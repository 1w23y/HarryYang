document.addEventListener('DOMContentLoaded', function () {  // Execute after the DOM of the document is loaded
    const urlParams = new URLSearchParams(window.location.search);  // Create URLSearchParams to parse the query parameters in the page URL
    const fundraiserId = urlParams.get('id');  // Obtain the id value from the query parameter
    // If you don't get an id, find 'fundraiser-info' and set the HTML content as the prompt
    if (!fundraiserId) {
        const fundraiserInfoDiv = document.getElementById('fundraiser-info');
        fundraiserInfoDiv.innerHTML = 'Please search and select a fundraiser to view details.';
    } else {
        // If you get the id, send a request to the server to get the campaign information and display the obtained campaign data to the page
        fetch(`http://localhost:3060/api/Crowdfunding/fundraiser/${fundraiserId}`)
           .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
           .then(fundraiserData => {
                const fundraiserInfoDiv = document.getElementById('fundraiser-info');
                fundraiserInfoDiv.innerHTML = `
                    <h2>${fundraiserData.CAPTION}</h2>
                    <p>ID: ${fundraiserData.FUNDRAISER_ID}</p>
                    <p>Organizer: ${fundraiserData.ORGANIZER}</p>
                    <p>Target Funding: ${fundraiserData.TARGET_FUNDING + ' AUD'}</p>
                    <p>Current Funding: ${fundraiserData.CURRENT_FUNDING + ' AUD'}</p>
                    <p>City: ${fundraiserData.CITY}</p>
                    <p>Active: ${fundraiserData.ACTIVE? 'Active' : 'Inactive'}</p>
                    <p>Category: ${fundraiserData.category_name}</p>
                `;
            })
           .catch(error => {   // If an error occurs, an error message is printed and displayed
                console.error('Error fetching fundraiser data:', error);
                const fundraiserInfoDiv = document.getElementById('fundraiser-info');
                fundraiserInfoDiv.innerHTML = 'Error fetching fundraiser details.';
            });
    }
});

const donateButton = document.getElementById('donate-button');  // Get the donate-button

donateButton.addEventListener('click', () => {    //Setting Click Donate and the prompt box will pop up
    alert('This feature is under construction.');
});