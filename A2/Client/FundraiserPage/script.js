document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const fundraiserId = urlParams.get('id');
    if (!fundraiserId) {
        const fundraiserInfoDiv = document.getElementById('fundraiser-info');
        fundraiserInfoDiv.innerHTML = 'Please search and select a fundraiser to view details.';
    } else {
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
           .catch(error => {
                console.error('Error fetching fundraiser data:', error);
                const fundraiserInfoDiv = document.getElementById('fundraiser-info');
                fundraiserInfoDiv.innerHTML = 'Error fetching fundraiser details.';
            });
    }
});

const donateButton = document.getElementById('donate-button');
donateButton.addEventListener('click', () => {
    alert('This feature is under construction.');
});