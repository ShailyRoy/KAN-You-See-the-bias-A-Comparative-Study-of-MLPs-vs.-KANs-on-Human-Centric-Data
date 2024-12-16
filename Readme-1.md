
----------------------------------------  
**Title:** KAN You See the Bias?  
**Subtitle:** A Comparative Journey Between MLPs and KANs on Human-Centric Data  
**Authors:** Harshit Sharma • Chenwei Cui • Shaily Roy • Sanika Chavan • Thor Abbasi

----------------------------------------  
**1.1 Setting the Stage: What is Algorithmic Bias?**

Imagine a world where you apply for a job, a loan, or a college admission, and an invisible algorithm decides your fate. This unseen force isn’t always fair. Algorithmic bias occurs when computer systems—often powered by machine learning, a method where computers learn patterns from examples—produce skewed results that disadvantage certain groups. These biases can stem from flawed training data, incorrect assumptions, or missing features.

Why It Matters:  
When these biases emerge, real people are affected. Unfair outcomes can influence who gets hired, who receives a loan, and how justice is served. Recognizing bias is the first step toward building more equitable solutions.

----------------------------------------  
**1.2 A Closer Look: The ADULT Dataset**

Consider the widely studied ADULT dataset, derived from 1994 U.S. census data. Its goal seems simple: predict whether a person’s income surpasses $50,000. Yet this dataset carries historical imbalances—such as underrepresented high-earning females—that lead models trained on it to inherit societal prejudices. In other words, these machine learning models can “learn” to undervalue certain groups, continuing a cycle of inequality.

----------------------------------------  
**1.3 Revealing Bias through Confusion Matrices**

Below, we use a confusion matrix—a table showing correct and incorrect predictions—to understand how gender influences outcomes. When you select a gender, notice how the matrix changes. Machine learning models sometimes fail more often for certain groups, reflecting deeper biases hidden in the data.

Key Insights:  
- TP: Correctly predicted high-income individuals  
- TN: Correctly predicted low-income individuals  
- FP: Incorrectly labeled low-income individuals as high-income  
- FN: Missed identifying actual high-income individuals

Why It Matters:  
By exposing these patterns, we shine a light on hidden inequalities. This understanding is crucial for improving fairness in algorithms that increasingly shape human opportunities. A small oversight at the data level can balloon into large-scale unfairness in society.

A Shift in Perspective:  
Next, we’ll explore the Weasd (originally WESAD) dataset, focusing on wearable sensor data. By understanding how different datasets and sensor placements affect what models learn, we uncover new layers of complexity—and opportunity—for reducing bias.

----------------------------------------  
**2.1 Introducing the Weasd Dataset**

The Weasd dataset is a rich collection of physiological signals from wearable sensors that track stress and emotional states. From 15 participants (12 male, 3 female), it records signals like:

- EDA (Electrodermal Activity): Reflects skin conductance changes, often linked to stress.  
- BVP (Blood Volume Pulse): Indicates heart rate patterns and alerts us to cardiovascular responses.  
- TEMP (Temperature): Captures subtle shifts in body heat correlated with emotions or relaxation.

These participants differ in age, height, weight, and dominant hand, influencing how sensors pick up signals. Visual “glyphs” represent each participant, encoding attributes (like color for gender or brightness for age) into simple figures. Hover over these glyphs to see each participant’s story and scroll to journey through their physiological worlds.

Why It Matters:  
By analyzing diverse data modalities, we uncover how different signals can reveal distinct biases in model training. Understanding these nuances helps us consider fairness across multiple dimensions.

----------------------------------------  
**2.2 Exploring Participant Profiles**

The Weasd dataset, though rich in physiological data, presents notable challenges in its demographic composition. With only 15 participants (12 males and 3 females), the dataset is inherently imbalanced. This male overrepresentation skews the model’s training, as it primarily learns patterns from a male-dominated dataset. Consequently, the model may develop biases that unfairly compare female participants’ data to male standards, given the unequal representation.

Beyond gender, other types of bias are possible too (such as age distribution or lack of ethnic diversity), although we didn’t explicitly detail these here. Such multifaceted biases might further influence how models interpret signals, but our focus remains on the gender imbalance as a primary lens.

These challenges highlight the importance of designing datasets that are not only diverse but also balanced. Without addressing such imbalances, models trained on the Weasd data risk perpetuating biases and producing inequitable results.

----------------------------------------  
**3.0 Approaching Bias Analysis with MLPs and KANs**

Before we delve into the specifics of MLPs (Multilayer Perceptrons) and KANs (Kolmogorov-Arnold Networks), it’s important to understand that these two models are the primary tools we use to analyze bias within the Weasd dataset. Both models are applied to identify patterns and discrepancies in how data is interpreted, ultimately helping us reveal hidden biases.

The key question here: How do these different architectures handle the inherent imbalances in the Weasd dataset? MLPs, being more traditional, might absorb biases more directly from the skewed data. KANs, with their structured approach, may mitigate some biases but potentially at a cost to raw performance.

Below is a similar visualization setup as in Section 3.1, showing a complexity slider for model configurations. Such visual tools help us see how changes in model complexity influence the learning process and, consequently, how biases might be amplified or reduced.

----------------------------------------  
**3.1 Understanding MLPs**

A Multilayer Perceptron (MLP) is a classic type of neural network made of layered digital “neurons.” It learns patterns from data inputs to predict outcomes. On the Weasd dataset, if the input data is imbalanced or skewed, an MLP can unintentionally learn biased decision boundaries. For example, with fewer female participants, the MLP might perform better on male data simply due to more exposure, reinforcing inequalities.

Use the slider below to see how changing complexity might affect an MLP’s fit. More complexity can mean better pattern recognition, but it can also mean overfitting and amplifying the biases learned from the Weasd dataset.

----------------------------------------  
**3.2 Introducing KANs**

Kolmogorov-Arnold Networks (KANs) add structure to how the network learns, potentially reducing reliance on raw data correlations. This structured approach can help models generalize better, possibly reducing the bias carried over from the Weasd dataset’s imbalanced training distribution. Instead of just memorizing patterns aligned with the majority group, a KAN might seek more fundamental representations, thereby distributing focus more evenly across all participants.

In this storyline, the KAN attempts to buffer against direct bias absorption, aiming for a fairer understanding of individuals in the Weasd dataset. While it may slightly reduce overall accuracy compared to a heavily biased MLP, it attempts to deliver a more equitable outcome for all subgroups.

Why It Matters:  
KANs represent a step toward fairer AI by not just learning from past distributions but by reasoning about patterns more robustly. For the Weasd dataset, this can soften the impact of historical imbalances and lead to more equitable outcomes across different participant groups.

----------------------------------------  
**3.3 MLP vs KAN: Trade-offs in Generalization (tied to Weasd dataset)**

While MLPs might capture strong predictive patterns more quickly, they risk overfitting biases inherent in the Weasd dataset. KANs strive for fairness and better generalization, redistributing attention to underrepresented groups. However, this quest for balance might slightly reduce raw accuracy. It’s a delicate balance: achieving fairness often involves these trade-offs, especially evident when analyzing the Weasd participants’ data.

----------------------------------------  
**4.1 Visualizing Bias in MLPs and KANs (tied to Weasd dataset)**

Here, visualize error distributions across groups for MLPs and KANs trained on the Weasd dataset. Notice how MLPs may produce skewed errors for certain demographics, while KANs distribute errors more evenly. These visuals help us see bias at a glance, ensuring that the disparities in the Weasd dataset are made evident.

----------------------------------------  
**4.2 Adjusting Model Confidence (tied to Weasd dataset)**

By tweaking a model’s confidence threshold, you can shift which outcomes it considers “positive.” Adjust the slider and see how subtle changes in decision-making criteria can help or harm certain groups within the Weasd dataset. For example, at a certain threshold, an MLP might achieve around 85% accuracy for the male subgroup but only 75% for the female subgroup, highlighting the learned bias. A KAN, on the other hand, might achieve more balanced results—e.g., around 80% for males and 78% for females—even if it doesn’t reach the MLP’s peak accuracy on the majority group.

These accuracy figures illustrate that while MLPs might win in raw predictive power under biased conditions, their advantage comes at the expense of fairness. KANs attempt to strike a more equitable balance, ensuring that both male and female participants in the Weasd dataset receive more consistent treatment from the model.

----------------------------------------  
**4.3 Individual-Level Performance (tied to Weasd dataset)**

Drilling down to individuals and subgroups within the Weasd dataset, we can spot hidden pockets of bias. These “hidden pockets” might be smaller communities or individuals with unique personal attributes—such as a participant with atypical EDA responses or an uncommon physiological profile that doesn’t fit neatly into majority patterns. Without targeted analysis, such subtleties remain concealed, potentially disadvantaging those at the margins.

Why It Matters:  
Fairness isn’t just about broad strokes; it’s about ensuring each participant in the Weasd dataset gets equitable treatment. Identifying bias at this finer scale makes the story more personal—and its lessons more urgent. By recognizing these micro-level disparities, we can refine models like KANs and MLPs to respect individual differences, rather than enforcing one-size-fits-all patterns derived from imbalanced data.

----------------------------------------  
**5.1 Interpreting the Results**

By looking at fairness metrics like demographic parity or equal opportunity via radar charts, we can compare how different models stack up. This not only shows where improvements are needed but also where progress has been made. For the Weasd dataset, such metrics highlight how KANs may improve fairness metrics, even if MLPs edge them out in raw accuracy.

----------------------------------------  
**5.2 Recommendations Moving Forward**

We’ve seen that KANs might mitigate some biases in the Weasd dataset but at a performance cost. Reducing bias is a journey—refining data, exploring new models, and continually testing fairness metrics. This is how we move forward, step by step.

Equity in AI doesn’t appear overnight. But by understanding these trade-offs, we can guide models toward a more just and responsible future.

----------------------------------------  
**6.1 Thank You for Joining Us**

From the ADULT dataset to the Weasd dataset, and from MLPs to KANs, we’ve witnessed that fair and insightful AI hinges on both technical finesse and ethical consideration. As you leave this story, think about how every tweak in an algorithm shapes the world we share.

Why It Matters:  
Algorithmic fairness is everyone’s concern. Your awareness and input can drive change, ensuring that the future of machine learning respects and uplifts all communities.

----------------------------------------
