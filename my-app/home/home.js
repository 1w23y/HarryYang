document.getElementById('add-fundraiser-btn').addEventListener('click', () => {
    document.getElementById('add-fundraiser-form').style.display = 'block';
});

document.getElementById('cancel-add-btn').addEventListener('click', () => {
    document.getElementById('add-fundraiser-form').style.display = 'none';
});

document.getElementById('save-btn').addEventListener('click', () => {
    const organizer = document.getElementById('organizer-input').value;
    const caption = document.getElementById('caption-input').value;
    const targetFunding = document.getElementById('target-funding-input').value;
    const currentFunding = document.getElementById('current-funding-input').value;
    const city = document.getElementById('city-input').value;
    const active = document.getElementById('active-input').value;
    const categoryId = document.getElementById('categoryId-input').value;

    if (!organizer ||!caption ||!targetFunding ||!currentFunding ||!city ||!categoryId) {
        alert('Please fill in all fields.');
        return;
    }

    fetch('http://localhost:3060/api/Crowdfunding/updateFundraiser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            organizer,
            caption,
            targetFunding,
            currentFunding,
            city,
            active,
            categoryId
        })
    })
   .then(response => response.text())
   .then(message => {
        if (message === 'Fundraiser inserted successfully') {
            document.getElementById('add-fundraiser-form').style.display = 'none';
            alert('Fundraiser added successfully!');
        } else {
            alert('Error adding fundraiser: ' + message);
        }
    })
   .catch(error => {
        console.error('Error adding fundraiser:', error);
    });
});

// 函数用于获取并显示捐赠列表
function displayDonations(fundraiserId) {
    const donationsListContainer = document.createElement('div');
    donationsListContainer.classList.add('donations-list');
    fetch(`http://localhost:3060/api/Crowdfunding//fundraiser/${fundraiserId}`)
   .then(response => response.json())
   .then(fundraiserData => {
        // 检查是否有捐赠数据
        if (fundraiserData.donation_ids) {
            const donationIds = fundraiserData.donation_ids.split(',');
            const donationDates = fundraiserData.donation_dates.split(',');
            const donationAmounts = fundraiserData.donation_amounts.split(',');
            const donationGivers = fundraiserData.donation_givers.split(',');
            for (let i = 0; i < donationIds.length; i++) {
                const donationItem = document.createElement('p');
                donationItem.textContent = `ID:${donationIds[i]},Donor: ${donationGivers[i]}, Amount: ${donationAmounts[i] + ' AUD'},Date:${donationDates[i]} `;
                donationsListContainer.appendChild(donationItem);
            }
        } else {
            donationsListContainer.textContent = 'No donations yet.';
        }
        return donationsListContainer;
    })
   .catch(error => {
        console.error('Error fetching donations:', error);
        donationsListContainer.textContent = 'Error fetching donations.';
        return donationsListContainer;
    });
    return donationsListContainer;
}

fetch("http://localhost:3060/api/Crowdfunding")
.then(response => response.json())
.then(data => {
    const fundraisersList = document.getElementById('fundraisers-list');
    data.forEach(fundraiser => {
        if (fundraiser.ACTIVE) {
            const fundraiserItem = document.createElement('div');
            fundraiserItem.classList.add('fundraiser-item');
            fundraiserItem.innerHTML = `
                <h3 style="text-align:left;">${fundraiser.CAPTION}</h3>
                <p style="text-align:left;">ID: ${fundraiser.FUNDRAISER_ID}</p>
                <p style="text-align:left;">Organizer: ${fundraiser.ORGANIZER}</p>
                <p style="text-align:left;">Target Funding: ${fundraiser.TARGET_FUNDING + ' AUD'}</p>
                <p style="text-align:left;">Current Funding: ${fundraiser.CURRENT_FUNDING + ' AUD'}</p>
                <p style="text-align:left;">City: ${fundraiser.CITY}</p>
                <p style="text-align:left;">Active: ${fundraiser.ACTIVE? 'Active' : 'Inactive'}</p>
                <p style="text-align:left;">Category: ${fundraiser.category_name}</p>
                <button class="edit-btn" data-fundraiser-id="${fundraiser.FUNDRAISER_ID}">Edit</button>
                <button class="delete-btn" data-fundraiser-id="${fundraiser.FUNDRAISER_ID}">Delete</button>
            `;
            fundraisersList.appendChild(fundraiserItem);

            function bindEditButton() {
                fundraiserItem.querySelector('.edit-btn').addEventListener('click', () => {
                    const fundraiserId = fundraiserItem.querySelector('.edit-btn').getAttribute('data-fundraiser-id');
                    const originalContent = fundraiserItem.innerHTML;

                    const organizerInput = document.createElement('input');
                    organizerInput.value = fundraiser.ORGANIZER;
                    const captionInput = document.createElement('input');
                    captionInput.value = fundraiser.CAPTION;
                    const targetFundingInput = document.createElement('input');
                    targetFundingInput.value = fundraiser.TARGET_FUNDING;
                    const currentFundingInput = document.createElement('input');
                    currentFundingInput.value = fundraiser.CURRENT_FUNDING;
                    const cityInput = document.createElement('input');
                    cityInput.value = fundraiser.CITY;
                    const activeSelect = document.createElement('select');
                    const activeTrueOption = document.createElement('option');
                    activeTrueOption.value = '1';
                    activeTrueOption.textContent = 'True';
                    const activeFalseOption = document.createElement('option');
                    activeFalseOption.value = '2';
                    activeFalseOption.textContent = 'False';
                    activeSelect.appendChild(activeTrueOption);
                    activeSelect.appendChild(activeFalseOption);
                    activeSelect.value = fundraiser.ACTIVE? '1' : '2';
                    const categorySelect = document.createElement('select');
                    const categoryPeopleOption = document.createElement('option');
                    categoryPeopleOption.value = '1';
                    categoryPeopleOption.textContent = 'People';
                    const categorySocietyOption = document.createElement('option');
                    categorySocietyOption.value = '2';
                    categorySocietyOption.textContent = 'Society';
                    const categoryNatureOption = document.createElement('option');
                    categoryNatureOption.value = '3';
                    categoryNatureOption.textContent = 'Nature';
                    const categoryDisasterOption = document.createElement('option');
                    categoryDisasterOption.value = '4';
                    categoryDisasterOption.textContent = 'Disaster';
                    const categoryCultureOption = document.createElement('option');
                    categoryCultureOption.value = '5';
                    categoryCultureOption.textContent = 'Culture';
                    categorySelect.appendChild(categoryPeopleOption);
                    categorySelect.appendChild(categorySocietyOption);
                    categorySelect.appendChild(categoryNatureOption);
                    categorySelect.appendChild(categoryDisasterOption);
                    categorySelect.appendChild(categoryCultureOption);
                    categorySelect.value = fundraiser.category_id;

                    const saveEditButton = document.createElement('button');
                    saveEditButton.textContent = 'Save Edit';
                    const cancelEditButton = document.createElement('button');
                    cancelEditButton.textContent = 'Cancel Edit';
                    cancelEditButton.addEventListener('click', () => {
                        // 取消编辑，恢复原始显示
                        fundraiserItem.innerHTML = originalContent;
                        // 重新绑定编辑按钮的事件监听器
                        bindEditButton();
                    });

                    saveEditButton.addEventListener('click', async () => {
                        const updatedData = {
                            organizer: organizerInput.value,
                            caption: captionInput.value,
                            targetFunding: targetFundingInput.value,
                            currentFunding: currentFundingInput.value,
                            city: cityInput.value,
                            active: activeSelect.value === '1',
                            categoryId: categorySelect.value
                        };
                        const response = await fetch(`http://localhost:3060/api/Crowdfunding/updateFundraiser/${fundraiserId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updatedData)
                        });
                        const message = await response.text();
                        if (message === 'Fundraiser updated successfully') {
                            fundraiserItem.innerHTML = `
                                <h3 style="text-align:left;">${captionInput.value}</h3>
                                <p style="text-align:left;">ID: ${fundraiserId}</p>
                                <p style="text-align:left;">Organizer: ${organizerInput.value}</p>
                                <p style="text-align:left;">Target Funding: ${targetFundingInput.value + ' AUD'}</p>
                                <p style="text-align:left;">Current Funding: ${currentFundingInput.value + ' AUD'}</p>
                                <p style="text-align:left;">City: ${cityInput.value}</p>
                                <p style="text-align:left;">Active: ${activeSelect.value === '1'? 'Active' : 'Inactive'}</p>
                                <p style="text-align:left;">Category: ${categorySelect.value}</p>
                                <button class="edit-btn" data-fundraiser-id="${fundraiserId}">Edit</button>
                                <button class="delete-btn" data-fundraiser-id="${fundraiserId}">Delete</button>
                            `;
                        } else {
                            alert('Error updating fundraiser: ' + message);
                        }
                    });

                    const donationsList = displayDonations(fundraiserId);

                    // 创建一个新的容器用于放置编辑内容
                    const editContainer = document.createElement('div');
                    editContainer.classList.add('edit-content');
                    editContainer.appendChild(organizerInput);
                    editContainer.appendChild(captionInput);
                    editContainer.appendChild(targetFundingInput);
                    editContainer.appendChild(currentFundingInput);
                    editContainer.appendChild(cityInput);
                    editContainer.appendChild(activeSelect);
                    editContainer.appendChild(categorySelect);
                    editContainer.appendChild(saveEditButton);
                    editContainer.appendChild(cancelEditButton);
                    editContainer.appendChild(donationsList);

                    fundraiserItem.appendChild(editContainer);
                });
            }

            // 初始绑定编辑按钮的事件监听器
            bindEditButton();

            fundraiserItem.querySelector('.delete-btn').addEventListener('click', async () => {
                const fundraiserId = fundraiserItem.querySelector('.delete-btn').getAttribute('data-fundraiser-id');
                const response = await fetch(`http://localhost:3060/api/Crowdfunding/deleteFundraiser/${fundraiserId}`, {
                    method: 'DELETE'
                });
                const message = await response.text();
                if (message === 'Fundraiser deleted successfully') {
                    fundraiserItem.remove();
                } else {
                    alert('Error deleting fundraiser: ' + message);
                }
            });
        }
    });
})
.catch(error => {
    console.error('Error fetching active fundraisers:', error);
});