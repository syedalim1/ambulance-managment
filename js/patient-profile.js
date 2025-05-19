/**
 * Patient Profile Page Functionality
 * Handles profile management, form editing, and modal interactions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Profile menu navigation
    const profileMenuItems = document.querySelectorAll('.profile-menu-item');
    const profileSections = document.querySelectorAll('.profile-section');
    
    // Edit buttons
    const editPersonalInfoBtn = document.getElementById('edit-personal-info');
    const editMedicalInfoBtn = document.getElementById('edit-medical-info');
    const editEmergencyContactsBtn = document.getElementById('edit-emergency-contacts');
    const editAddressesBtn = document.getElementById('edit-addresses');
    
    // Cancel buttons
    const cancelPersonalInfoBtn = document.getElementById('cancel-personal-info');
    const cancelMedicalInfoBtn = document.getElementById('cancel-medical-info');
    
    // Forms
    const personalInfoForm = document.getElementById('personal-info-form');
    const medicalInfoForm = document.getElementById('medical-info-form');
    
    // Modals
    const addContactModal = document.getElementById('add-contact-modal');
    const addAddressModal = document.getElementById('add-address-modal');
    const changePasswordModal = document.getElementById('change-password-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Other elements
    const addContactBtn = document.querySelector('.add-contact-btn');
    const addAddressBtn = document.querySelector('.add-address-btn');
    const securityChangePasswordBtn = document.querySelector('.security-card:nth-child(1) .btn-secondary');
    const avatarUpload = document.getElementById('avatar-upload');
    
    // Profile menu navigation
    profileMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all menu items
            profileMenuItems.forEach(menuItem => menuItem.classList.remove('active'));
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('data-target');
            
            // Hide all sections
            profileSections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // Edit personal information
    editPersonalInfoBtn.addEventListener('click', function() {
        // Enable form fields
        const formInputs = personalInfoForm.querySelectorAll('input, select');
        formInputs.forEach(input => input.disabled = false);
        
        // Show form actions
        personalInfoForm.querySelector('.form-actions').style.display = 'flex';
        
        // Hide edit button
        this.style.display = 'none';
    });
    
    // Cancel personal information edit
    cancelPersonalInfoBtn.addEventListener('click', function() {
        // Disable form fields
        const formInputs = personalInfoForm.querySelectorAll('input, select');
        formInputs.forEach(input => input.disabled = true);
        
        // Hide form actions
        personalInfoForm.querySelector('.form-actions').style.display = 'none';
        
        // Show edit button
        editPersonalInfoBtn.style.display = 'block';
        
        // Reset form to original values
        personalInfoForm.reset();
    });
    
    // Submit personal information form
    personalInfoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        
        // Update profile name
        document.getElementById('profile-name').textContent = firstName + ' ' + lastName;
        document.getElementById('nav-user-name').textContent = firstName;
        
        // In a real app, this would send the data to the server
        console.log({
            firstName,
            lastName,
            email,
            phone,
            dob,
            gender
        });
        
        // Show success message
        showNotification('Personal information updated successfully', 'success');
        
        // Disable form fields
        const formInputs = personalInfoForm.querySelectorAll('input, select');
        formInputs.forEach(input => input.disabled = true);
        
        // Hide form actions
        personalInfoForm.querySelector('.form-actions').style.display = 'none';
        
        // Show edit button
        editPersonalInfoBtn.style.display = 'block';
    });
    
    // Edit medical information
    editMedicalInfoBtn.addEventListener('click', function() {
        // Enable form fields
        const formInputs = medicalInfoForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => input.disabled = false);
        
        // Enable buttons
        medicalInfoForm.querySelector('.add-insurance-btn').disabled = false;
        
        // Show form actions
        medicalInfoForm.querySelector('.form-actions').style.display = 'flex';
        
        // Hide edit button
        this.style.display = 'none';
        
        // Enable tag removal
        const tagRemoveButtons = document.querySelectorAll('.tag .fa-times');
        tagRemoveButtons.forEach(btn => {
            btn.style.display = 'inline-block';
            btn.addEventListener('click', function() {
                this.parentNode.remove();
            });
        });
    });
    
    // Cancel medical information edit
    cancelMedicalInfoBtn.addEventListener('click', function() {
        // Disable form fields
        const formInputs = medicalInfoForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => input.disabled = true);
        
        // Disable buttons
        medicalInfoForm.querySelector('.add-insurance-btn').disabled = true;
        
        // Hide form actions
        medicalInfoForm.querySelector('.form-actions').style.display = 'none';
        
        // Show edit button
        editMedicalInfoBtn.style.display = 'block';
        
        // Reset form to original values
        medicalInfoForm.reset();
        
        // Hide tag removal buttons
        const tagRemoveButtons = document.querySelectorAll('.tag .fa-times');
        tagRemoveButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    });
    
    // Submit medical information form
    medicalInfoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const bloodGroup = document.getElementById('blood-group').value;
        const allergies = Array.from(document.querySelectorAll('#allergies-list .tag')).map(tag => tag.textContent.trim());
        const medications = Array.from(document.querySelectorAll('#medications-list .tag')).map(tag => tag.textContent.trim());
        const medicalConditions = document.getElementById('medical-conditions').value;
        
        // In a real app, this would send the data to the server
        console.log({
            bloodGroup,
            allergies,
            medications,
            medicalConditions
        });
        
        // Show success message
        showNotification('Medical information updated successfully', 'success');
        
        // Disable form fields
        const formInputs = medicalInfoForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => input.disabled = true);
        
        // Disable buttons
        medicalInfoForm.querySelector('.add-insurance-btn').disabled = true;
        
        // Hide form actions
        medicalInfoForm.querySelector('.form-actions').style.display = 'none';
        
        // Show edit button
        editMedicalInfoBtn.style.display = 'block';
        
        // Hide tag removal buttons
        const tagRemoveButtons = document.querySelectorAll('.tag .fa-times');
        tagRemoveButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    });
    
    // Edit emergency contacts
    editEmergencyContactsBtn.addEventListener('click', function() {
        // Show contact actions
        const contactActions = document.querySelectorAll('.contact-actions');
        contactActions.forEach(actions => actions.style.display = 'flex');
        
        // Show add contact button
        addContactBtn.style.display = 'block';
        
        // Hide edit button
        this.style.display = 'none';
        
        // Add event listeners to edit and delete buttons
        const editContactButtons = document.querySelectorAll('.edit-contact-btn');
        const deleteContactButtons = document.querySelectorAll('.delete-contact-btn');
        
        editContactButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const contactCard = this.closest('.contact-card');
                const contactName = contactCard.querySelector('h3').textContent;
                const contactRelationship = contactCard.querySelector('p:nth-child(2)').textContent.replace('Relationship: ', '');
                const contactPhone = contactCard.querySelector('p:nth-child(3)').textContent.replace('Phone: ', '');
                const contactEmail = contactCard.querySelector('p:nth-child(4)').textContent.replace('Email: ', '');
                
                // Open add contact modal with pre-filled data
                document.getElementById('contact-name').value = contactName;
                document.getElementById('contact-relationship').value = contactRelationship;
                document.getElementById('contact-phone').value = contactPhone;
                document.getElementById('contact-email').value = contactEmail;
                
                // Change modal title
                addContactModal.querySelector('h2').textContent = 'Edit Emergency Contact';
                
                // Open modal
                openModal(addContactModal);
            });
        });
        
        deleteContactButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this contact?')) {
                    this.closest('.contact-card').remove();
                }
            });
        });
    });
    
    // Edit addresses
    editAddressesBtn.addEventListener('click', function() {
        // Show address actions
        const addressActions = document.querySelectorAll('.address-actions');
        addressActions.forEach(actions => actions.style.display = 'flex');
        
        // Show add address button
        addAddressBtn.style.display = 'block';
        
        // Hide edit button
        this.style.display = 'none';
        
        // Add event listeners to edit and delete buttons
        const editAddressButtons = document.querySelectorAll('.edit-address-btn');
        const deleteAddressButtons = document.querySelectorAll('.delete-address-btn');
        
        editAddressButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const addressCard = this.closest('.address-card');
                const addressLabel = addressCard.querySelector('.address-badge').textContent.toLowerCase();
                const addressLine1 = addressCard.querySelector('h3').textContent;
                const addressLine2 = addressCard.querySelector('p:nth-child(1)').textContent;
                const cityStatePostal = addressCard.querySelector('p:nth-child(2)').textContent.split(', ');
                const city = cityStatePostal[0];
                const statePostal = cityStatePostal[1].split(' ');
                const state = statePostal[0];
                const postal = statePostal[1];
                const country = addressCard.querySelector('p:nth-child(3)').textContent;
                
                // Open add address modal with pre-filled data
                document.getElementById('address-label').value = addressLabel;
                document.getElementById('address-line1').value = addressLine1;
                document.getElementById('address-line2').value = addressLine2;
                document.getElementById('address-city').value = city;
                document.getElementById('address-state').value = state;
                document.getElementById('address-postal').value = postal;
                document.getElementById('address-country').value = country;
                
                // Change modal title
                addAddressModal.querySelector('h2').textContent = 'Edit Address';
                
                // Open modal
                openModal(addAddressModal);
            });
        });
        
        deleteAddressButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this address?')) {
                    this.closest('.address-card').remove();
                }
            });
        });
    });
    
    // Add contact button
    addContactBtn.addEventListener('click', function() {
        // Reset form
        document.getElementById('add-contact-form').reset();
        
        // Change modal title
        addContactModal.querySelector('h2').textContent = 'Add Emergency Contact';
        
        // Open modal
        openModal(addContactModal);
    });
    
    // Add address button
    addAddressBtn.addEventListener('click', function() {
        // Reset form
        document.getElementById('add-address-form').reset();
        
        // Change modal title
        addAddressModal.querySelector('h2').textContent = 'Add New Address';
        
        // Open modal
        openModal(addAddressModal);
    });
    
    // Change password button
    securityChangePasswordBtn.addEventListener('click', function() {
        // Reset form
        document.getElementById('change-password-form').reset();
        
        // Open modal
        openModal(changePasswordModal);
    });
    
    // Add contact form submission
    document.getElementById('add-contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const contactName = document.getElementById('contact-name').value;
        const contactRelationship = document.getElementById('contact-relationship').value;
        const contactPhone = document.getElementById('contact-phone').value;
        const contactEmail = document.getElementById('contact-email').value;
        
        // Create new contact card
        const contactCard = document.createElement('div');
        contactCard.className = 'contact-card';
        contactCard.innerHTML = `
            <div class="contact-info">
                <h3>${contactName}</h3>
                <p><i class="fas fa-user"></i> ${contactRelationship}</p>
                <p><i class="fas fa-phone"></i> ${contactPhone}</p>
                <p><i class="fas fa-envelope"></i> ${contactEmail}</p>
            </div>
            <div class="contact-actions" style="display: flex;">
                <button class="action-btn edit-contact-btn"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-contact-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add event listeners to new buttons
        contactCard.querySelector('.edit-contact-btn').addEventListener('click', function() {
            const contactCard = this.closest('.contact-card');
            const contactName = contactCard.querySelector('h3').textContent;
            const contactRelationship = contactCard.querySelector('p:nth-child(2)').textContent.replace('Relationship: ', '');
            const contactPhone = contactCard.querySelector('p:nth-child(3)').textContent.replace('Phone: ', '');
            const contactEmail = contactCard.querySelector('p:nth-child(4)').textContent.replace('Email: ', '');
            
            // Open add contact modal with pre-filled data
            document.getElementById('contact-name').value = contactName;
            document.getElementById('contact-relationship').value = contactRelationship;
            document.getElementById('contact-phone').value = contactPhone;
            document.getElementById('contact-email').value = contactEmail;
            
            // Change modal title
            addContactModal.querySelector('h2').textContent = 'Edit Emergency Contact';
            
            // Open modal
            openModal(addContactModal);
        });
        
        contactCard.querySelector('.delete-contact-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this contact?')) {
                this.closest('.contact-card').remove();
            }
        });
        
        // Add to contacts list
        document.querySelector('.emergency-contacts-list').insertBefore(contactCard, addContactBtn);
        
        // Close modal
        closeModal(addContactModal);
        
        // Show success message
        showNotification('Emergency contact added successfully', 'success');
    });
    
    // Add address form submission
    document.getElementById('add-address-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const addressLabel = document.getElementById('address-label').value;
        const addressLine1 = document.getElementById('address-line1').value;
        const addressLine2 = document.getElementById('address-line2').value;
        const addressCity = document.getElementById('address-city').value;
        const addressState = document.getElementById('address-state').value;
        const addressPostal = document.getElementById('address-postal').value;
        const addressCountry = document.getElementById('address-country').value;
        
        // Create new address card
        const addressCard = document.createElement('div');
        addressCard.className = 'address-card';
        addressCard.innerHTML = `
            <div class="address-badge ${addressLabel}">${addressLabel.charAt(0).toUpperCase() + addressLabel.slice(1)}</div>
            <div class="address-info">
                <h3>${addressLine1}</h3>
                <p>${addressLine2}</p>
                <p>${addressCity}, ${addressState} ${addressPostal}</p>
                <p>${addressCountry}</p>
            </div>
            <div class="address-actions" style="display: flex;">
                <button class="action-btn edit-address-btn"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-address-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add event listeners to new buttons
        addressCard.querySelector('.edit-address-btn').addEventListener('click', function() {
            const addressCard = this.closest('.address-card');
            const addressLabel = addressCard.querySelector('.address-badge').textContent.toLowerCase();
            const addressLine1 = addressCard.querySelector('h3').textContent;
            const addressLine2 = addressCard.querySelector('p:nth-child(1)').textContent;
            const cityStatePostal = addressCard.querySelector('p:nth-child(2)').textContent.split(', ');
            const city = cityStatePostal[0];
            const statePostal = cityStatePostal[1].split(' ');
            const state = statePostal[0];
            const postal = statePostal[1];
            const country = addressCard.querySelector('p:nth-child(3)').textContent;
            
            // Open add address modal with pre-filled data
            document.getElementById('address-label').value = addressLabel;
            document.getElementById('address-line1').value = addressLine1;
            document.getElementById('address-line2').value = addressLine2;
            document.getElementById('address-city').value = city;
            document.getElementById('address-state').value = state;
            document.getElementById('address-postal').value = postal;
            document.getElementById('address-country').value = country;
            
            // Change modal title
            addAddressModal.querySelector('h2').textContent = 'Edit Address';
            
            // Open modal
            openModal(addAddressModal);
        });
        
        addressCard.querySelector('.delete-address-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this address?')) {
                this.closest('.address-card').remove();
            }
        });
        
        // Add to addresses list
        document.querySelector('.addresses-list').insertBefore(addressCard, addAddressBtn);
        
        // Close modal
        closeModal(addAddressModal);
        
        // Show success message
        showNotification('Address added successfully', 'success');
    });
    
    // Change password form submission
    document.getElementById('change-password-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate passwords
        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }
        
        // In a real app, this would send the data to the server
        console.log({
            currentPassword,
            newPassword
        });
        
        // Close modal
        closeModal(changePasswordModal);
        
        // Show success message
        showNotification('Password changed successfully', 'success');
    });
    
    // Password strength meter
    const newPassword = document.getElementById('new-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    newPassword.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // Update strength bar
        strengthBar.style.width = strength.score * 25 + '%';
        strengthBar.className = 'strength-bar ' + strength.level;
        
        // Update strength text
        strengthText.textContent = 'Password strength: ' + strength.level;
    });
    
    // Avatar upload
    avatarUpload.addEventListener('change', function() {
        const file = this.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                document.getElementById('profile-image').src = e.target.result;
            };
            
            reader.readAsDataURL(file);
            
            // Show success message
            showNotification('Profile picture updated successfully', 'success');
        }
    });
    
    // Add tag functionality for allergies and medications
    const allergiesInput = document.getElementById('allergies-input');
    const medicationsInput = document.getElementById('medications-input');
    
    allergiesInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            e.preventDefault();
            
            // Create new tag
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = this.value.trim() + '<i class="fas fa-times"></i>';
            
            // Add event listener to remove button
            tag.querySelector('.fa-times').addEventListener('click', function() {
                this.parentNode.remove();
            });
            
            // Add to allergies list
            document.getElementById('allergies-list').appendChild(tag);
            
            // Clear input
            this.value = '';
        }
    });
    
    medicationsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            e.preventDefault();
            
            // Create new tag
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = this.value.trim() + '<i class="fas fa-times"></i>';
            
            // Add event listener to remove button
            tag.querySelector('.fa-times').addEventListener('click', function() {
                this.parentNode.remove();
            });
            
            // Add to medications list
            document.getElementById('medications-list').appendChild(tag);
            
            // Clear input
            this.value = '';
        }
    });
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Cancel buttons for modals
    document.getElementById('cancel-add-contact').addEventListener('click', function() {
        closeModal(addContactModal);
    });
    
    document.getElementById('cancel-add-address').addEventListener('click', function() {
        closeModal(addAddressModal);
    });
    
    document.getElementById('cancel-change-password').addEventListener('click', function() {
        closeModal(changePasswordModal);
    });
    
    // Open modal with animation
    function openModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
    
    // Close modal with animation
    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Show notification
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification ' + type;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Calculate password strength
    function calculatePasswordStrength(password) {
        let score = 0;
        let level = 'weak';
        
        // Length check
        if (password.length >= 8) {
            score++;
        }
        
        // Uppercase check
        if (/[A-Z]/.test(password)) {
            score++;
        }
        
        // Lowercase check
        if (/[a-z]/.test(password)) {
            score++;
        }
        
        // Number check
        if (/[0-9]/.test(password)) {
            score++;
        }
        
        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        }
        
        // Determine level
        if (score <= 2) {
            level = 'weak';
        } else if (score <= 3) {
            level = 'medium';
        } else {
            level = 'strong';
        }
        
        return {
            score,
            level
        };
    }
});
