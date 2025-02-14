import { useState } from 'react';
import { zkVerifySession, Library, CurveType, ZkVerifyEvents } from 'zkverifyjs';

interface ImageData {
  proof: any;
  correctLabel: number;
}

export const useZkVerify = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const verifyProof = async (imageData: ImageData, userLabel: number) => {
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationSuccess(false);

    try {
      // Initialize session with testnet
      const session = await zkVerifySession.start()
        .Testnet()
        .withAccount(process.env.REACT_APP_SEED_PHRASE || '');

      console.log("ZkVerify session started successfully");

      // Get verification key hash from stored file or register new one
      let vkeyHash;
      try {
        const response = await fetch('/vkey.json');
        const existingVkey = await response.json();
        vkeyHash = existingVkey.hash;
        console.log("Using existing verification key:", vkeyHash);
      } catch (error) {
        console.log("Registering new verification key...");
        // Register new verification key if not found
        const { events: regEvents } = await session
          .registerVerificationKey()
          .groth16(Library.snarkjs, CurveType.bn128)
          .execute({
            proof: imageData.proof,
            publicSignals: [userLabel, imageData.correctLabel]
          });

        vkeyHash = await new Promise((resolve, reject) => {
          regEvents.on(ZkVerifyEvents.Finalized, (eventData) => {
            console.log("Verification key registered:", eventData.statementHash);
            resolve(eventData.statementHash);
          });

          regEvents.on('error', (error) => {
            console.error("Verification key registration error:", error);
            reject(error);
          });

          setTimeout(() => reject(new Error('Verification key registration timeout')), 60000);
        });
      }

      console.log("Submitting proof for verification...");
      // Submit proof for verification
      const { events } = await session
        .verify()
        .groth16(Library.snarkjs, CurveType.bn128)
        .waitForPublishedAttestation()
        .withRegisteredVk()
        .execute({
          proofData: {
            vk: vkeyHash,
            proof: imageData.proof,
            publicSignals: [userLabel, imageData.correctLabel]
          }
        });

      return new Promise((resolve, reject) => {
        events.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
          console.log('Proof included in block:', eventData);
        });

        events.on(ZkVerifyEvents.Finalized, (eventData) => {
          console.log('Proof finalized:', eventData);
        });

        events.on(ZkVerifyEvents.AttestationConfirmed, async (eventData) => {
          console.log('Attestation confirmed:', eventData);
          setVerificationSuccess(true);
          resolve(true);
        });

        events.on('error', (error) => {
          console.error('Verification error:', error);
          setVerificationError(error.message);
          reject(error);
        });

        // Timeout after 2 minutes
        setTimeout(() => {
          const error = new Error('Verification timeout');
          setVerificationError(error.message);
          reject(error);
        }, 120000);
      });

    } catch (error: any) {
      console.error('ZkVerify error:', error);
      setVerificationError(error.message);
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    verifyProof,
    isVerifying,
    verificationError,
    verificationSuccess
  };
};

export default useZkVerify; 