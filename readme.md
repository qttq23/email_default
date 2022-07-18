
1. email overview
eg: abc@example.com  
abc is account name.  
@ is 'at'.  
example.com is hostname. hostname can also be: api1.xyz.example.com  

when you buy a domain name (eg: buy 'example.com' at google domain).   
it allows you to set up DNS, you set MX record for email server. for example, you set 'email.example.com' for MX record.  
then if someone sends email to `account1@email.example.com`, that email will be stored in your email server at email.example.com  

usually, create and manage your own email server is an overwork.  
you might prefer external email service such as Google Workspace to handle those works for your.  
if you use Google Workspace, it provides email service and help you set up DNS.  


# how email work:
just take a look at figure 7.1   
https://www.oasis-open.org/khelp/kmlm/user_help/html/how_email_works.html

Sender's Mail Client (MUA) -> Sender's Mail server (MDA/MTA) -> DNS, internet -> Recipient's Mail Server (MDA/MTA) -> Recipient's Mail Client (MUA) 

eg: you using `Gmail` to login as `abc@outlook.com` then send an email to `xyz@yahoo.com`.  
the `gmail` is your Sender's Mail client (MUA).   
it sends a request to `outlook.com` (Sender's mail server) to send an email to `xyz@yahoo.com`.  
Sender's mail server looks up DNS of `yahoo.com` and and send email to that ip address.  
Yahoo's recipient's mail server receives email and store it to account `xyz`.  
The person 'xyz', if want to retrieve new coming email, needs to login to Recipient's mail client, for ex: Yahoo (or Gmail) mail client.  
Recipient's mail client will fetch new emails from Recipient's mail server. 


more common terms:  
https://www.namecheap.com/guru-guides/how-does-email-work/


2. google workspace
- a set of tools such as: Gmail, Google Drive, calendar, Meet... with more resources and spaces to use.
- allow custom email address (abcxyz@example.net) and manage emails for an organization.

## individual (not recommended)
- not allow custom email
- not available at your current location :(
-> not recommended

https://workspace.google.com/individual/?hl=en

## education (not recommended)
- allow custom email
- must confirm identity of your education institution.
-> impossible

https://edu.google.com/workspace-for-education/editions/compare-editions/  
https://edu.google.com/workspace-for-education/editions/education-fundamentals/

## business (recommended)
- 14 day free trial.
- allow custom email & manage users.
- don't require proving identity of organization.
- require a domain name (eg: example.net) so that custom email will be like abc123@example.net
- the free trial does not require your credit card. after free trial, if you don't provide billing information, all accounts will be deleted and no charge at all.
- the custom email in google workspace is an valid google account in the sense that you can login to google using that account and authenticate in OAuth2 with google provider.

practice:  
to set up new Google Workspace Business, just go to:   
https://workspace.google.com/  
and click 'Get Started'.  
It basically ask you for your owned domain. Google Workspace, by default, set the free trial of Business Starter for you when you set up.  
after set up, you can go to Admin console > billing > subscriptions to view and change plan.  


(  
Sign up for Google Workspace:  
https://support.google.com/a/answer/9983832  
further guides:  
https://support.google.com/a/answer/6043576?hl=en&ref_topic=4388346  
)

3. gmail api
google workspace provides developers the API (libraries as well as rest api) to interact with resources such as gmail, calendar, ...  
you can create an app that uses Gmail api to read new comming emails and send emails.  

usually, you should use an account associated with google workspace to create a google cloud project.  
(using google workspace api in normal cloud project is ok but some features/api are only available to projects associated with an organization)  

(
overview:
https://developers.google.com/workspace/guides/get-started  
)

# authentication
for gmail api that read & send email on behalf of end user, you should authenticate using Oauth2 flow to get user consent.   
But this is not common because they can just use Gmail app to do better things than your app.  
(https://developers.google.com/workspace/guides/create-credentials#oauth-client-id)  

for app that use gmail api to read emails, distribute requests to staffs to process then send responses back, you should use Service Account with Domain-wide delegate.  
the strategy is that you create a service account in your project and set domain-wide delegate. It means that service account can impersonate anyone in your organization.  
(the service account itself basically does not represent anyone).  
use that service account to impersonate the `support@example.net` to read & send message.  
your customer just needs to send feedbacks to `support@example.net` and your app can receive those emails, dispatch to staffs.  
your staffs processes feedbacks then use your app to send reponses back to customers.  

(
https://developers.google.com/identity/protocols/oauth2/service-account#creatinganaccount  
https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority  
)

# gmail api: get and send email

simple get & send email at `gmail_api` folder.

in practice, you need to comprehend more concepts such as thread, label, history to implement email features completely.  
(https://developers.google.com/gmail/api/guides/threads)

(
nodejs libraries:  
https://googleapis.dev/nodejs/googleapis/latest/gmail/index.html  
issues: https://github.com/googleapis/google-api-nodejs-client/issues/2322
)

