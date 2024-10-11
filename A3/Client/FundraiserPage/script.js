document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const fundraiserId = urlParams.get('id');
    if (!fundraiserId) {
        const fundraiserInfoDiv = document.getElementById('fundraiser-info');
        fundraiserInfoDiv.innerHTML = 'Please search and select a fundraiser to view details.';
    } else {
        localStorage.setItem('fundraiserId', fundraiserId);
        fetch(`http://localhost:3060/api/Crowdfunding/fundraiser/${fundraiserId}`)
           .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
           .then(fundraiserData => {
                const fundraiserInfoDiv = document.getElementById('fundraiser-info');
                let fundraiserDetailsHTML = '';
                if (fundraiserData) {
                    fundraiserDetailsHTML += `
                        <h2>${fundraiserData.CAPTION}</h2>
                        <p>ID: ${fundraiserData.FUNDRAISER_ID}</p>
                        <p>Organizer: ${fundraiserData.ORGANIZER}</p>
                        <p>Target Funding: ${fundraiserData.TARGET_FUNDING + ' AUD'}</p>
                        <p>Current Funding: ${fundraiserData.CURRENT_FUNDING + ' AUD'}</p>
                        <p>City: ${fundraiserData.CITY}</p>
                        <p>Active: ${fundraiserData.ACTIVE? 'Active' : 'Inactive'}</p>
                        <p>Category: ${fundraiserData.category_name}</p>
                    `;
                    fundraiserInfoDiv.innerHTML = fundraiserDetailsHTML;
                    const donationList = document.getElementById('donation-list');
                    if (fundraiserData.donation_ids && fundraiserData.donation_dates && fundraiserData.donation_amounts && fundraiserData.donation_givers) {
                        const donationIds = fundraiserData.donation_ids.split(',');
                        const donationDates = fundraiserData.donation_dates.split(',');
                        const donationAmounts = fundraiserData.donation_amounts.split(',');
                        const donationGivers = fundraiserData.donation_givers.split(',');
                        const donations = [];
                        for (let i = 0; i < donationIds.length; i++) {
                            donations.push({
                                id: donationIds[i],
                                date: donationDates[i],
                                amount: donationAmounts[i],
                                giver: donationGivers[i]
                            });
                        }
                        donationList.innerHTML = '<h2>Donation List</h2>';
                        donations.forEach(donation => {
                            const donationItem = document.createElement('li');
                            donationItem.innerHTML = `Donation Id: ${donation.id} &nbsp; &nbsp; Date: ${donation.date} &nbsp; &nbsp; Amount: ${donation.amount} AUD &nbsp; &nbsp; Giver: ${donation.giver} &nbsp; &nbsp;`;
                            donationList.appendChild(donationItem);
                        });
                    } else {
                        donationList.innerHTML = '<li>No donors yet.</li>';
                    }
                } else {
                    fundraiserInfoDiv.innerHTML = 'Error fetching fundraiser details.';
                }
            })
           .catch(error => {
                console.error('Error fetching fundraiser data:', error);
                const fundraiserInfoDiv = document.getElementById('fundraiser-info');
                fundraiserInfoDiv.innerHTML = 'Error fetching fundraiser details.';
            });
    }
    const donateButton = document.getElementById('donate-button');
    donateButton.addEventListener('click', function () {
        window.location.href = 'http://localhost:8080/DonationPage/donation.html';
    });
});