// Define clearCheckboxes to clear the search criteria entry box
function clearCheckboxes() {
    //Set to an empty string
    document.getElementById('organizer').value = '';
    document.getElementById('city').value = '';
    document.getElementById('category').value = '';
}

// Define searchFundraisers to search for fundraisers
function searchFundraisers() {
    //Gets the value of the input field
    const organizer = document.getElementById('organizer').value;
    const city = document.getElementById('city').value;
    const category = document.getElementById('category').value;
    const hasSelectedCriteria = organizer || city || category;  //Determine whether the input field contains text
    if (!hasSelectedCriteria) {    //If not, a message is displayed
        alert('Please select at least one search criteria');
        return;
    }
    const searchParams = new URLSearchParams();   // Create URLSearchParams to store search parameters
    // If the input field has text, store it
    if (organizer) {
        searchParams.append('organizer', organizer);
    }
    if (city) {
        searchParams.append('city', city);
    }
    if (category) {
        searchParams.append('category', category);
    }
    // Build the URL of the search API
    const apiUrl = 'http://localhost:3060/api/Crowdfunding?' + searchParams.toString();
    // Send a request to the search API
    fetch(apiUrl)
      .then(response => {
            if (!response.ok) {
                // If the response status is not ok, issue an error message
                throw new Error('Network response was not ok');
            }
            // Returns JSON data for the response
            return response.json();
        })
      .then(data => {
            const searchResults = document.getElementById('search-results');   // Gets the element with ID search-results
            searchResults.innerHTML = '';    // Clear the search results area
            let foundIds = [];       // Create an array to store the found activity ids
            // Traverse the search results
            data.forEach(item => {
                let match = true;
                // Assign false to match if there is no match
                if (organizer && item.ORGANIZER!== organizer) {
                    match = false;
                }
                if (city && item.CITY!== city) {
                    match = false;
                }
                if (category && item.CATEGORY_ID!== parseInt(category)) {
                    match = false;
                }
                if (match) {       // Add the ID to the ID array if it matches
                    foundIds.push(item.FUNDRAISER_ID);
                }
            });
            if (foundIds.length > 0) {        // If we find a fundraiser
                foundIds.forEach(id => {
                    const fundraiserItem = document.createElement('p');   // Create a paragraph element to display fundraising campaign information
                    const link = document.createElement('a');      // Create a link element
                    const foundItem = data.find(item => item.FUNDRAISER_ID === id);   //Look for corresponding activities
                    link.href = '../FundraiserPage/fundraiser.html?id=' + id;       // Set the link's href attribute to the details page with the corresponding activity ID
                    link.textContent = `${foundItem.CAPTION} - ${foundItem.ORGANIZER}`; //Set link text
                    fundraiserItem.appendChild(link);   //Link added to paragraph
                    searchResults.appendChild(fundraiserItem);  //Link added to search
                });
            } else {
                // If no activity is found, create an error message
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

// Acquisition sort
document.addEventListener('DOMContentLoaded', function () {
    // Send a request to get classified data
    fetch('http://localhost:3060/api/Crowdfunding/category')
      .then(response => response.json())
      .then(categories => {
            const categorySelect = document.getElementById('category');
            // Create a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select a category';
            // Add a drop-down menu of default options
            categorySelect.appendChild(defaultOption);
            // Iterate over the obtained classification data
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.CATEGORY_ID;
                option.textContent = category.NAME;
                categorySelect.appendChild(option);  // Add options to the category drop-down menu
            });
        })
      .catch(error => {
            console.error('Error fetching categories:', error);
        });
});