import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression

def prepare_data(data):
    # converting categorical variables to numeric
    le = LabelEncoder()
    categorical_features = ['workclass', 'education', 'marital-status', 'occupation', 
                          'relationship', 'race', 'gender', 'native-country']
    
    for feature in categorical_features:
        data[feature] = le.fit_transform(data[feature].astype(str))
    
    # splitting features and target
    X = data.drop('income', axis=1)
    
    # creating binary labels: 1 for >50K, 0 for <=50K
    income_labels = data['income'].str.strip()
    y = (income_labels == '>50K').astype(int)
    
    # verifying the conversion
    print("\nOriginal income values:")
    print(income_labels.value_counts())
    print("\nConverted to binary:")
    print(y.value_counts())
    print("\n0 = <=50K, 1 = >50K")
    
    return X, y

def train_model():
    # loading data
    data = pd.read_csv('chapter-1/adult.data', header=None, delimiter=',')
    data.columns = ['age', 'workclass', 'fnlwgt', 'education', 'education-num', 
                   'marital-status', 'occupation', 'relationship', 'race', 'gender',
                   'capital-gain', 'capital-loss', 'hours-per-week', 'native-country', 'income']
    
    # printing first few rows of income to verify loading
    print("Sample of raw income values:")
    print(data['income'].head())
    
    # preparing data
    X, y = prepare_data(data)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # training model
    model = LogisticRegression(random_state=42)
    model.fit(X_train, y_train)
    
    # making predictions
    predictions = model.predict(X_test)
    
    # convert predictions back to original labels for saving
    results = pd.DataFrame({
        'actual': ['>50K' if x == 1 else '<=50K' for x in y_test],
        'predicted': ['>50K' if x == 1 else '<=50K' for x in predictions],
        'gender': X_test['gender'],
        'race': X_test['race']
    })
    
    results.to_csv('chapter-1/predictions.csv', index=False)

if __name__ == "__main__":
    train_model()

