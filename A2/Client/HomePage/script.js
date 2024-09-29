fetch("http://localhost:3060/api/Crowdfunding")
   .then(response => response.json())
   .then(data => {
        const fundraisersList = document.getElementById('fundraisers-list');
        data.forEach(fundraiser => {
            const fundraiserItem = document.createElement('div');
            fundraiserItem.classList.add('fundraiser-item');
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
            console.log(imgSrc);
            img.src = imgSrc;
            fundraiserItem.appendChild(img);
            fundraisersList.appendChild(fundraiserItem);
        });
    })
   .catch(error => {
        console.error('Error fetching active fundraisers:', error);
    });