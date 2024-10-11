window.onload = function () {
    let fundraiserId;
    if (localStorage.getItem('fundraiserId')) {
        fundraiserId = localStorage.getItem('fundraiserId');
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        fundraiserId = urlParams.get('id');
    }

    function fetchFundraiserDetails() {
        if (!fundraiserId) {
            console.error('No fundraiser ID found.');
            return;
        }
        return fetch(`http://localhost:3060/api/Crowdfunding/fundraiser/${fundraiserId}`)
          .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
        }
            let fundraiserData;
            fetchFundraiserDetails() 
            .then(data => {
                fundraiserData = data;
                const fundraiserDetailsDiv = document.getElementById('fundraiser-details');
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
                    console.error('Fundraiser details div not found.');
                }
                const titleElement = document.getElementsByTagName('h1')[0];
                titleElement.textContent = `Donation for ${fundraiserData.CAPTION}`;
            })
          .catch(error => {
                console.error('Error fetching fundraiser details:', error);
            });

    document.getElementById('donation-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const amount = document.getElementById('amount').value;
        const giver = document.getElementById('giver').value;
        if (amount < 5) {
            alert('The minimum donation is 5 AUD.');
            return;
        }
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
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
          .then(message => {
                alert(`Thank you for your donation to ${fundraiserData.CAPTION}`);
                window.location.href = `http://localhost:8080/FundraiserPage/fundraiser.html?id=${fundraiserId}`;
            })
          .catch(error => {
                console.error('Error submitting donation:', error);
            });
    });
};