# Chenwei-Harshit-Sanika-Shaily-Thor
## This repository contains the source code for our Team Project for CSE-578 - Fall 2024



# KAN You See the Bias?

## Project Overview
This project investigates algorithmic bias in machine learning models using human-centric data, particularly physiological signals from the WESAD dataset. It compares two neural network architectures:  
- MLPs (Multi-Layer Perceptrons)  
- KANs (Kolmogorov-Arnold Networks)  

By leveraging scrollytelling, and interactive and novel visualizations, this project explains how machine learning models can have biases.

## Folder Structure

```
KAN-You-See-The-Bias/
│
├── chapter-1/          # Code and content for Chapter 1
├── chapter-2/          # Code and content for Chapter 2
├── chapter-3/          # Code and content for Chapter 3
├── chapter-4/          # Code and content for Chapter 4
├── chapter-5/          # Code and content for Chapter 5
├── chapter-6/          # Code and content for Chapter 6
├── photos/             # Images and visual assets for the project
├── index.html          # Main entry point for the visualization
├── main.js             # JavaScript logic for visualization
├── story.css           # Supporting CSS for the story section
├── styles.css          # Main styles for the visualization
├── README.md           # This file
└── Readme-1.md         # Updated storyline
```

## Dependencies
To run this project locally, you will need the following tools and libraries:
1. Web Browser: Chrome, Firefox, or any modern browser (Ensure zoom level is set to 100% for optimal visualization).
2. D3.js: Version 7 (included via CDN in the project).
3. Scrollama: For scroll-based interactivity (loaded via unpkg CDN).

## How to Run

1. Clone the Repository
   Open a terminal and clone this repository using:
   ```bash
   git clone git@github.com:asu-cse578-f2024/Chenwei-Harshit-Sanika-Shaily-Thor.git
   ```

2. Navigate to the Project Directory
   ```bash
   cd KAN-You-See-The-Bias
   ```

3. Run the Project
   To run `index.html` in a web browser. You can do the following:

   Run the following command in the terminal:
   ```bash
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000/index.html` in your browser.

4. Ensure Zoom Level
   Make sure your browser zoom level is set to 100% to ensure that visualizations render correctly.

## Visualization Flow  
1. Algorithmic Bias:  
   - Introduction to the concept of bias in machine learning.  

2. ADULT Dataset:  
   - Explanation and insights using confusion matrices to reveal gender disparities.

3. WESAD Dataset:  
   - Physiological signals explored using scatter-line plots:  
     - EDA (Electrodermal Activity)  
     - BVP (Blood Volume Pulse)  
     - TEMP (Temperature)  

4. Modeling with Neural Networks:  
   - MLPs: Classic networks highlighting accuracy bias.  
   - KANs: Novel networks improving fairness and generalization.

5. Results Comparison:  
   - Individual and gender-based performance visualizations for MLPs vs. KANs.  
   - Trade-off analysis

6. Future Directions:  
   - Improving datasets and adopting advanced architectures like Transformers.



## Insights  
- MLPs excel in accuracy but show bias favoring majority groups.  
- KANs offer better fairness by improving generalization across underrepresented groups.  
- Physiological Data: Female participants exhibit higher variability in signals like BVP, influencing model performance.  


## Contributions  
- Harshit Sharma  
- Chenwei Cui  
- Shaily Roy  
- Sanika Chavan  
- Thor Abbasi  

## Support
If you encounter any issues:
1. Ensure dependencies (D3.js, Scrollama) are loading correctly.
2. Verify that the browser zoom level is set to 100%.
3. Open a GitHub issue with details of the problem.



## References  
1. Ziad Obermeyer et al., *Dissecting Racial Bias in Algorithms*. Science, 2019.  
2. Jiaqi Wang et al., *Deep Learning for Physiological Signal Analysis*. Artificial Intelligence in Medicine, 2020.  
3. Ziming Liu et al., *Kolmogorov-Arnold Networks*. arXiv preprint, 2024.  
4. Dheeru Dua, *ADULT Dataset*. UCI Machine Learning Repository, 2019.  
5. Philip Schmidt et al., *Introducing WESAD Dataset*. ACM ICMI, 2018.  
