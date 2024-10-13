window.onload = function () {
    // Try to get the fundraiser ID from local storage. If not found, get it from URL parameters.
    let fundraiserId;
    if (localStorage.getItem('fundraiserId')) {
        fundraiserId = localStorage.getItem('fundraiserId');
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        fundraiserId = urlParams.get('id');
    }

    function fetchFundraiserDetails() {
        // If there is no fundraiser ID, log an error and return.
        if (!fundraiserId) {
            console.error('No fundraiser ID found.');
            return;
        }
        // Send a request to fetch fundraiser details.
        return fetch(`http://localhost:3060/api/Crowdfunding/fundraiser/${fundraiserId}`)
           .then(response => {
                // If the response is not okay, throw an error.
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Return the JSON data from the response.
                return response.json();
            });
    }

    let fundraiserData;
    fetchFundraiserDetails()
       .then(data => {
            // Save the fetched fundraiser data.
            fundraiserData = data;
            const fundraiserDetailsDiv = document.getElementById('fundraiser-details');
            // If the div for fundraiser details is found, update its content.
            if (fundraiserDetailsDiv) {
                fundraiserDetailsDiv.innerHTML = `
                        <p>ID: ${fundraiserData.FUNDRAISER_ID}</p>
                        <p>Organizer: ${fundraiserData.ORGANIZER}</p>
                        <p>Target Funding: ${fundraiserData.TARGET_FUNDING + ' AUD'}</p>
                        <p>Current Funding: ${fundraiserData.CURRENT_FUNDING + ' AUD'}</p>
                        <p>City: ${fundraiserData.CITY}</p>
                        <p>Active: ${fundraiserData.ACTIVE? 'Active' : 'Inactive'}</p>
                        <p>Category: ${fundraiserData.category_name}</p>
                    `;
            } else {
                // If the div is not found, log an error.
                console.error('Fundraiser details div not found.');
            }
            const titleElement = document.getElementsByTagName('h1')[0];
            // Update the page title.
            titleElement.textContent = `Donation for ${fundraiserData.CAPTION}`;
        })
       .catch(error => {
            // If there is an error fetching fundraiser details, log the error.
            console.error('Error fetching fundraiser details:', error);
        });

    document.getElementById('donation-form').addEventListener('submit', function (event) {
        // Prevent the default form submission behavior.
        event.preventDefault();
        const amount = document.getElementById('amount').value;
        const giver = document.getElementById('giver').value;
        // If the donation amount is less than 5 AUD, show an alert and return.
        if (amount < 5) {
            alert('The minimum donation is 5 AUD.');
            return;
        }
        // Send a POST request to add donation information.
        fetch('http://localhost:3060/api/Crowdfunding/donation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: new Date().toISOString().split('T')[0],
                amount: amount,
                giver: giver,
                fundraiserId: fundraiserId
            })
        })
           .then(response => {
                // If the response is not okay, throw an error.
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Return the response text.
                return response.text();
            })
           .then(message => {
                // Show a thank you message and redirect to the fundraiser details page.
                alert(`Thank you for your donation to ${fundraiserData.CAPTION}`);
                window.location.href = `http://localhost:8080/FundraiserPage/fundraiser.html?id=${fundraiserId}`;
            })
           .catch(error => {
                // If there is an error submitting the donation, log the error.
                console.error('Error submitting donation:', error);
            });
    });
};