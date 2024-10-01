fetch("http://localhost:3060/api/Crowdfunding")   // Use fetch to send http requests to urls
   .then(response => response.json())             //Get a response and call the response.json() method
   .then(data => {
        const fundraisersList = document.getElementById('fundraisers-list');   // Traverse the activity data
        data.forEach(fundraiser => {
            const fundraiserItem = document.createElement('div');  //Create a div to represent a single fundraiser item
            fundraiserItem.classList.add('fundraiser-item');   // Add a CSS class name
            //Generate html dynamically and insert elements
            fundraiserItem.innerHTML = `             
                <h3>${fundraiser.CAPTION}</h3>
                <p>ID: ${fundraiser.FUNDRAISER_ID}</p>
                <p>Organizer: ${fundraiser.ORGANIZER}</p>
                <p>Target Funding: ${fundraiser.TARGET_FUNDING + ' AUD'}</p>
                <p>Current Funding: ${fundraiser.CURRENT_FUNDING + ' AUD'}</p>
                <p>City: ${fundraiser.CITY}</p>
                <p>Active: ${fundraiser.ACTIVE? 'Active' : 'Inactive'}</p>
                <p>Category: ${fundraiser.category_name}</p>
            `;
            // Add pictures according to the activity category and set the path
            let imgSrc = '';
            switch (fundraiser.CATEGORY_ID) {
                case 1:
                    imgSrc = '../HomePage/image1.jpg';
                    break;
                case 2:
                    imgSrc = '../HomePage/image2.jpg';
                    break;
                case 3:
                    imgSrc = '../HomePage/image3.jpg'; 
                    break;
            }
            const img = document.createElement('img');
            console.log(imgSrc);   //Acquisition path
            img.src = imgSrc;     //Assigns the path to the src attribute of img
            fundraiserItem.appendChild(img);  //Add the img element to the activity
            fundraisersList.appendChild(fundraiserItem); //Adds the activity to the activity list
        });
    })
   .catch(error => {                   //If an error occurs, print an error message
        console.error('Error fetching active fundraisers:', error);
    });