pragma circom 2.1.4;

template ImageLabeling() {
    signal input label;  // User's label (1 = YES, 0 = NO)
    signal input correctLabel;  // Correct label (ground truth)
    signal output isValid;  // Proof of correct labeling

    // Ensure label is either 0 (NO) or 1 (YES)
    assert(label == 0 || label == 1);

    // Correct label check
    signal isCorrect;
    isCorrect <== 0;  // Initialize signal
    isCorrect * (label - correctLabel) === 0;  // Ensures label == correctLabel
    isCorrect * (isCorrect - 1) === 0;  // Ensures isCorrect is 0 or 1

    // Final validation output
    isValid <== isCorrect;
}

component main = ImageLabeling();
