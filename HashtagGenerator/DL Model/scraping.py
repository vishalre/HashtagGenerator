# -*- coding: utf-8 -*-

# NumPy versions below 1.17 may be incompatible with some other 
# packages, so you may need to replace your current version with 
# an earlier one in order to run this notebook as-is. 
# !pip uninstall numpy --yes
# !pip install "numpy<1.17"
!pip install selenium

import numpy as np
import pandas as pd
# from selenium.webdriver import Chrome, Firefox
from functions import scrape_data
import os

# EXAMPLE:
# hashtags = ["travel", "food", "animals", "selfie", "cars", "fitness", "babies", "wedding", "nature", "architecture"]

# Your own hashtags here:
hashtags = ["food"]

# How many hashtags to scrape:
num_to_scrape = 1

# Make sure our data and metadata folders exist before we start scraping
folder_names = ["data", "metadata"]
for folder_name in folder_names:
    try:
        os.mkdir(folder_name)
    except OSError:
        print(f"Folder '{folder_name}' already exists.")


scrape_data(hashtags, num_to_scrape, delay=5)



# travel_df = pd.read_json("metadata/travel.json")
# travel_df.head()



