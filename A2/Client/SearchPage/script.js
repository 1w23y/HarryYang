function clearCheckboxes() {
    document.getElementById('organizer').value = '';
    document.getElementById('city').value = '';
    document.getElementById('category').value = '';
}

function searchFundraisers() {
    const organizer = document.getElementById('organizer').value;
    const city = document.getElementById('city').value;
    const category = document.getElementById('category').value;
    const hasSelectedCriteria = organizer || city || category;
    if (!hasSelectedCriteria) {
        alert('Please select at least one search criteria');
        return;
    }
    const searchParams = new URLSearchParams();
    if (organizer) {
        searchParams.append('organizer', organizer);
    }
    if (city) {
        searchParams.append('city', city);
    }
    if (category) {
        searchParams.append('category', category);
    }
    const apiUrl = 'http://localhost:3060/api/Crowdfunding?' + searchParams.toString();
    fetch(apiUrl)
   .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
   .then(data => {
        const searchResults = document.getElementById('search-results');
        searchResults.innerHTML = '';
        let foundIds = [];
        data.forEach(item => {
            let match = true;
            if (organizer && item.ORGANIZER!== organizer) {
                match = false;
            }
            if (city && item.CITY!== city) {
                match = false;
            }
            if (category && item.CATEGORY_ID!== parseInt(category)) {
                match = false;
            }
            if (match) {
                foundIds.push(item.FUNDRAISER_ID);
            }
        });
        if (foundIds.length > 0) {
            foundIds.forEach(id => {
                const fundraiserItem = document.createElement('p');
                const link = document.createElement('a');
                const foundItem = data.find(item => item.FUNDRAISER_ID === id);
                link.href = 'fundraiser.html?id=' + id;
                link.textContent = `${foundItem.CAPTION} - ${foundItem.ORGANIZER}`;
                fundraiserItem.appendChild(link);
                searchResults.appendChild(fundraiserItem);
            });
        } else {
            const noResultMessage = document.createElement('p');
            noResultMessage.style.color = 'red';
            noResultMessage.style.fontWeight = 'bold';
            noResultMessage.textContent = 'No fundraisers found';
            searchResults.appendChild(noResultMessage);
        }
    })
   .catch(error => {
        console.error('Error searching for fundraisers:', error);
    });
}