from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
 
options = webdriver.FirefoxOptions()
driver = webdriver.Firefox(options=options)
driver.get("https://www.instagram.com")
driver.maximize_window()

username = "Enter your username" 
password = "Enter your password"
try:
    #Log in to Instagram username
    username_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='username']")),
    )
    username_input.clear()
    username_input.send_keys(username)
    
    #Enter password
    password_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='password']")),
    )
    password_input.clear()
    password_input.send_keys(password + Keys.ENTER)
    
   #Click on the message icon
    messenger_icon = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "svg[aria-label='Messenger']")),
    )
    messenger_icon.click()
    
    
except Exception as e:
    print("Error ocurred as", e)