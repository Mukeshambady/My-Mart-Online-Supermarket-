# My-Mart-Online-Supermarket

ABSTRACT
Due to lock downs and quarantine people are not able to buy essential commodities from their nearest supermarkets and grocery shops . They are also forced to stay in line and wait in order to purchase essential commodities .And supermarkets and grocery shops cannot sell their products to the customers .My mart is a simple solution for the current situation we are going through . My mart helps customers and supermarkets connect and buy from their nearest supermarket .My Mart also has feature of no-contact delivery and online payment so customers can buy commodities with proper care 
# FEATURES
#1. USER
Users can login using the id and password  provided by the supermarket or  Sign in with  phone number .
User can give the location and flat number
User can track the status of the order real time 
User can view the list of Items 
User can view each Item in detail (Item)
User can add items to the cart 
User  can order and pay directly or pay on delivery 
User can add review of the order and rating (Remarks and Feedback) after receiving the order
User can see the order history
User can filter items by category 
User can search for items 

#2.SUPERMARKET 
Dealer can login 
Dealer can add items and make categories 
Dealer can receive order accept or reject order 
Dealer can view order history and data 
Dealer can view the orders in  real time and change the status of the orders
Dealer can manually set timings  for  Open/Close  for delivery or even disable it    
Dealer can issue username and password 
Dealer can view the review of the user and feedback 
Dealer can edit , delete items
Dealer can ban users   

#3.ADMIN 
Admin can create , delete , edit Dealers
Admin can view , edit, delete users 


 #MODULES

#USER
1. Login and Register 
#Login :
Login must be validated  (Both email and password )
Login page must show error messages 
When Login is validated :- Redirected to Home page or concerned page
If the user logins from order summary  page (Concerned Page )
If user logins in from cart (Concerned Page)


Login must have a link to register page  


#Register:-
Register credentials must be validated in real time 
Must show appropriate messages
Register must show error messages 
Registered user must be logged in and redirected to the concerned page
Register fields 
Name
Phone 
E-mail
Address / Flat No.
 
#2. Home and Product Page 
Home page must show items listed by a supermarket 
Should have a field for entering the location (Pre-filled if logged in)
Should have  Signup / Login or Profile name according to the status of the user 
Each item will be displayed in cards 
Each  card should have a cart logo and no. logo
No. of items can be added and subtracted and added to the cart
A small image of the item will be displayed in each card
Home page should have links to cart and order 
Home page should have a search field to search for the items 
Home page should have sorting option
Home page should show the open and close of the supermart
Product Page :-
Must display the product in detail 
The products price, image and description 
Add to Cart button and no. button 
#3. Cart and Order 
#Cart :
Should contain list of item  
The items should be displayed in cards 
Cards must contain the no. of  items and price of the items 
Another Huge card should contain order summary 	
Total amount 
No. of items 
Address 
Payment Mode
Payment Gateway:
Integrate a payment gateway (Razor pay )
Order Status and Order History:-
Should have an date attribute 
Order Status	(Integrate Push Notification )
Should show the order status in real time as progress bar 
Should  have three levels of progress 
Confirmed 
On the way
Delivered 
Rejected 
Should  show a feedback model after delivery 
Input field and a rating meter and close icon
Should redirect to the home page it is done 
Order History 
Should show order history of the current user in cards
 

#DEALER :
#1. LOGIN :
Login must be validated  (Both username  and password )
Login page must show error messages 
When Login is validated :-( Redirected to dash)

#2 . Dashboard
#Orders:-
Show the latest orders 
Orders should be shown in card 
Should contain the item,address,Username,View,Status toggler,Driver and submit button 
Status Toggler should contain :-(Pending,Confirmed,Rejected,Out for Delivery,Delivery) When delivered transferred to order history 
View button should open a model Containing all the item list and all the information and a print button also contain a unique ID for order 
#Order History:-
Should contain all the order history (Rejected and Delivered )
Search bar for searching the items by order_id and date
Delete the order 
#Item:-
Show all the products and its details in a list 
Should be able to add products
Product form 
Images, Name ,Price
Default image 
Description   
Category  
Existing or add new 
No of  items 
Inventory Icon 
Show how many products are left
Add Products (Total or add to existing )
Should be able to edit the product 
Show an edit form 
Delete / Disable the item 
Button to do that same 
Sort the items 
#Users:-
Should be able to view the users
Edit the users 
Delete / Temporary Disable the users 
Add the Users
Search the user
#Feedback:-
View the user feedback
Cards 
Delete the user feedback
Settings
Setup automatic timer for the closing and opening 
Temporary Disable 
Disable COD and Online Payment

#ADMIN :
#1. Login 
Login must be validated  (Both username  and password )
Login page must show error messages 
When Login is validated :-( Redirected to dash)  

#2. Dashboard
Dealer
Must be able to add Dealers
Must show a form for adding the Dealer
Fields for registration 	
Name
Store name 
Store image 
Location 
Contact information 
View Dealers
Show a list of Dealers 
Should show the name , Location ,Open status 
Disable Dealers
A button for disabling Dealers whenever necessary  
Edit the Dealers
Must redirect to a form containing values to edit 
Delete Dealers 
A delete button 
Settings 
Should contain disable button to disable the whole app

