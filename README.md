
### **Demo**-

[Demo Link](https://drive.google.com/file/d/1TPJkWm0iYj7VUde60d68pPEk_cy8kGVY/view?usp=sharing)

Below is a summary of our end-to-end fraud detection pipeline development:

---

### **1. Data Preprocessing & Sequence Generation**

- **Data Sorting:**
  - We started by sorting transaction data by user, card, and timestamp to ensure temporal order.
- **Sliding Window Approach:**
  - For each user-card group, we created a sliding window (initially 10, then experimented with 20) of consecutive transactions.
  - For each window, the target was set as the fraud flag for the transaction immediately after the window.
- **Parallel Processing:**
  - To speed up sequence generation, we implemented the windowing function using Python’s multiprocessing (with 12 processes) so that each user-card group is processed in parallel.

---

### **2. Feature Engineering**

- **Basic Statistical Features:**

  - For each sliding window, we computed **mean** and **standard deviation** for each feature.
  - We also computed **minimum, maximum, and range** (max-min) to capture the spread of values.
  - For the `'Amount'` feature, a **slope** (rate of change) was calculated to capture trend information.

- **Additional Behavioral & Frequency Features:**

  - **Transaction Timing:**
    - Calculated time differences between transactions (average, maximum, and minimum time differences).
  - **High-Value Transaction Metrics:**
    - Computed the percentage of transactions in the window that exceed the 75th percentile (to capture spikes).
    - Derived the rolling sum and average of transaction amounts.
  - **Diversity Metrics:**
    - Counted the number of unique merchants and unique MCC (Merchant Category Code) values within the window to capture behavior diversity.

- **Aggregated Feature Vector:**
  - The aggregated feature vector for each window became a concatenation of all these statistics and behavioral measures.

---

### **3. Modeling Approach**

- **Model Selection:**

  - We used **XGBoost** as our primary classifier on the aggregated features.
  - To tackle the extreme class imbalance, we adjusted **class weights** (via `scale_pos_weight`) so that the model paid more attention to the minority fraud class.

- **Threshold Tuning:**
  - Instead of the default 0.5 probability threshold, we tuned the decision threshold.
  - We experimented with different thresholds (0.4, 0.35, etc.) to improve recall, knowing that lowering the threshold increases true positives but can also increase false positives.

---

### **4. Testing & Evaluation**

- **Window Size Experiments:**
  - **Window = 10:**
    - Showed lower recall (around 54%) and very low precision (~10%).
  - **Window = 20:**
    - Improved both precision (to 18%) and recall (to 65%) compared to a smaller window.
- **Threshold Adjustments:**
  - We experimented with thresholds (e.g., 0.4 and 0.35) to maximize the number of true positives.
  - The threshold was tuned to trade off some precision for higher recall, ensuring more fraud cases are caught.

---

### **5. Final Results**

- **At Window Size = 20 with an Adjusted Threshold (~0.4):**
  - **Classification Report for Fraud (Class 1):**
    - **Precision:** 12% (i.e., when flagged as fraud, 12% of cases are actually fraud)
    - **Recall:** 70% (i.e., 70% of all fraud cases were detected)
    - **F1-Score:** 20%
  - **Confusion Matrix:**
    - True Negatives: 373,342
    - False Positives: 2,041
    - False Negatives: 118
    - True Positives: 275
- **Interpretation:**
  - The model is now catching significantly more fraud cases (increased recall) compared to the initial setup.
  - Although precision is still low (a common issue in imbalanced problems), these results are acceptable if the goal is to maximize true positives.

---

### **Summary**

- **We built a pipeline that:**
  - Preprocessed transaction data using a sliding window approach.
  - Engineered both basic statistical and advanced behavioral features.
  - Leveraged parallel processing for efficiency.
  - Employed an XGBoost classifier with cost-sensitive training.
  - Tuned the decision threshold to maximize fraud detection (recall) at the expense of some precision.
- **Final Outcome:**
  - With a window size of 20 and an adjusted threshold, we achieved a recall of 70% for fraud detection—meaning most fraud cases are caught, even though many non-fraud transactions are also flagged.

This end-to-end approach balances the need for high recall (maximizing true positives) while using enhanced feature engineering to better capture user behavior.

We have also built a webapp to demonstrate how the data will be flagged when new transaction occurs

---


