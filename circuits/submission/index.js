const { zkVerifySession, Library, CurveType, ZkVerifyEvents } = require("zkverifyjs");
const fs = require("fs");
require('dotenv').config();

// Import proof files
const proof = require("./data/proof.json");
const publicInputs = require("./data/public.json");
const verificationKey = require("./data/verification_key.json");

// Helper function to wait
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry operations with exponential backoff
async function retry(operation, maxAttempts = 10, initialDelay = 10000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            const delay = initialDelay * Math.pow(1.5, attempt - 1); // Exponential backoff
            console.log(`Attempt ${attempt} failed: ${error.message}`);
            console.log(`Waiting ${delay/1000} seconds before next attempt...`);
            await sleep(delay);
        }
    }
}

async function verifyProof() {
    try {
        // Initialize session with testnet
        const session = await zkVerifySession.start()
            .Testnet()
            .withAccount(process.env.SEED_PHRASE);

        console.log("Session started successfully");

        let vkeyHash;

        // Try to read existing vkey.json first
        try {
            const existingVkey = JSON.parse(fs.readFileSync("vkey.json"));
            vkeyHash = existingVkey.hash;
            console.log('Using existing verification key hash:', vkeyHash);
        } catch (error) {
            // If vkey.json doesn't exist or is invalid, register a new verification key
            console.log('Registering new verification key...');
            const { events: regEvents, regResult } = await session
                .registerVerificationKey()
                .groth16(Library.snarkjs, CurveType.bn128)
                .execute(verificationKey);

            // Wait for the verification key registration to be finalized
            vkeyHash = await new Promise((resolve, reject) => {
                regEvents.on(ZkVerifyEvents.Finalized, (eventData) => {
                    console.log('Registration finalized:', eventData);
                    const vkeyData = { "hash": eventData.statementHash };
                    fs.writeFileSync("vkey.json", JSON.stringify(vkeyData, null, 2));
                    resolve(eventData.statementHash);
                });

                setTimeout(() => {
                    reject(new Error('Verification key registration timeout'));
                }, 60000);
            });
        }

        console.log('Proceeding with proof verification using vkey hash:', vkeyHash);

        let transactionData = null;

        // Submit proof for verification
        const { events, txResults } = await session
            .verify()
            .groth16(Library.snarkjs, CurveType.bn128)
            .waitForPublishedAttestation()
            .withRegisteredVk()
            .execute({
                proofData: {
                    vk: vkeyHash,
                    proof: proof,
                    publicSignals: publicInputs
                }
            });

        // Listen for verification events
        events.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
            console.log('Transaction included in block:', eventData);
            transactionData = eventData; // Store transaction data
            fs.writeFileSync(
                "transaction_data.json", 
                JSON.stringify(eventData, null, 2)
            );
        });

        events.on(ZkVerifyEvents.Finalized, (eventData) => {
            console.log('Transaction finalized:', eventData);
        });

        // Listen for attestation confirmation and generate proof with retry mechanism
        events.on(ZkVerifyEvents.AttestationConfirmed, async(eventData) => {
            console.log('Attestation Confirmed. Event Data:', JSON.stringify(eventData, null, 2));
            
            // Save attestation data for debugging
            fs.writeFileSync(
                "attestation_event.json", 
                JSON.stringify(eventData, null, 2)
            );
            
            // Initial delay before first attempt
            console.log('Waiting 30 seconds before first proof retrieval attempt...');
            await sleep(30000);
            
            try {
                // Use the leaf digest from the transaction data
                const leafDigest = transactionData?.leafDigest;
                const attestationId = eventData.id;

                if (!leafDigest) {
                    throw new Error('Leaf digest not found in transaction data');
                }

                console.log(`Using transaction data:`, JSON.stringify(transactionData, null, 2));
                
                const proofDetails = await retry(async () => {
                    console.log(`Attempting to retrieve proof for attestation ID: ${attestationId}`);
                    console.log(`Using leaf digest: ${leafDigest}`);
                    return await session.poe(attestationId, leafDigest);
                });
                
                proofDetails.attestationId = attestationId;
                fs.writeFileSync(
                    "attestation.json", 
                    JSON.stringify(proofDetails, null, 2)
                );
                console.log("Success! Proof details saved to attestation.json:", proofDetails);
                process.exit(0); // Exit successfully after saving the proof
            } catch (error) {
                console.error("Failed to retrieve proof details after all retries:", error);
                process.exit(1); // Exit with error
            }
        });

        // Keep the process running to allow for event processing
        await new Promise((resolve) => {
            setTimeout(resolve, 10 * 60 * 1000); // Run for 10 minutes max
        });

    } catch (error) {
        console.error("Error during proof verification:", error);
        process.exit(1);
    }
}

// Execute the verification process
verifyProof().catch(console.error);
