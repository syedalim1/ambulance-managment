/**
 * Emergency Call Page Functionality
 * Handles emergency requests, location detection, and video calls
 */
document.addEventListener('DOMContentLoaded', function() {
    // Emergency request elements
    const requestAmbulanceBtn = document.getElementById('request-ambulance-btn');
    const videoCallBtn = document.getElementById('video-call-btn');
    const helplineBtn = document.getElementById('helpline-btn');
    const emergencyModal = document.getElementById('emergency-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const videoCallModal = document.getElementById('video-call-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Emergency request form elements
    const emergencyLocation = document.getElementById('emergency-location');
    const emergencyType = document.getElementById('emergency-type');
    const emergencyDetails = document.getElementById('emergency-details');
    const refreshLocationBtn = document.getElementById('refresh-location-btn');
    const cancelEmergencyBtn = document.getElementById('cancel-emergency-btn');
    const submitEmergencyBtn = document.getElementById('submit-emergency-btn');
    
    // Confirmation modal elements
    const etaTime = document.getElementById('eta-time');
    const closeConfirmationBtn = document.getElementById('close-confirmation');
    const callDriverBtn = document.getElementById('call-driver');
    
    // Video call elements
    const callTimer = document.querySelector('.call-timer');
    const controlBtns = document.querySelectorAll('.control-btn');
    const endCallBtn = document.querySelector('.end-call-btn');
    const mainVideoStream = document.querySelector('.main-video-stream');
    const selfVideoStream = document.querySelector('.self-video-stream');
    
    // Contact action buttons
    const contactActionBtns = document.querySelectorAll('.contact-actions button');
    const addContactCard = document.querySelector('.add-contact-card');
    
    // Location info element
    const locationInfo = document.getElementById('location-info');
    
    // Initialize page
    initPage();
    
    // Initialize page
    function initPage() {
        // Get user's location
        getUserLocation();
        
        // Load medical info from profile
        loadMedicalInfo();
    }
    
    // Get user's location
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    
                    // Get address from coordinates (reverse geocoding)
                    // In a real app, this would use a geocoding service
                    // For demo purposes, we'll use a placeholder
                    const address = "123 Main Street, Tirupati, Andhra Pradesh 517501";
                    
                    // Update location info
                    updateLocationInfo(address, latitude, longitude);
                    
                    // Update emergency location input
                    if (emergencyLocation) {
                        emergencyLocation.value = address;
                    }
                },
                function(error) {
                    console.error('Geolocation error:', error);
                    
                    // Update location info with error
                    locationInfo.innerHTML = `
                        <div class="location-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Unable to detect your location. Please allow location access.</span>
                            <button class="retry-location-btn">Retry</button>
                        </div>
                    `;
                    
                    // Add event listener to retry button
                    const retryBtn = locationInfo.querySelector('.retry-location-btn');
                    if (retryBtn) {
                        retryBtn.addEventListener('click', getUserLocation);
                    }
                    
                    // Update emergency location input
                    if (emergencyLocation) {
                        emergencyLocation.value = "Location not available";
                    }
                }
            );
        } else {
            // Geolocation not supported
            locationInfo.innerHTML = `
                <div class="location-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Geolocation is not supported by your browser.</span>
                </div>
            `;
            
            // Update emergency location input
            if (emergencyLocation) {
                emergencyLocation.value = "Location not available";
            }
        }
    }
    
    // Update location info
    function updateLocationInfo(address, latitude, longitude) {
        locationInfo.innerHTML = `
            <div class="location-success">
                <i class="fas fa-map-marker-alt"></i>
                <div class="location-details">
                    <span class="location-address">${address}</span>
                    <span class="location-coordinates">Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}</span>
                </div>
                <button class="update-location-btn">Update</button>
            </div>
        `;
        
        // Add event listener to update button
        const updateBtn = locationInfo.querySelector('.update-location-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', getUserLocation);
        }
    }
    
    // Load medical info from profile
    function loadMedicalInfo() {
        // In a real app, this would fetch data from the server
        // For demo purposes, we'll use hardcoded data
        document.getElementById('emergency-blood-group').textContent = 'B+';
        document.getElementById('emergency-allergies').textContent = 'Penicillin, Peanuts';
        document.getElementById('emergency-conditions').textContent = 'Hypertension, Type 2 Diabetes';
        document.getElementById('emergency-medications').textContent = 'Aspirin';
    }
    
    // Request ambulance button
    requestAmbulanceBtn.addEventListener('click', function() {
        openModal(emergencyModal);
    });
    
    // Video call button
    videoCallBtn.addEventListener('click', function() {
        openModal(videoCallModal);
        startVideoCall();
    });
    
    // Refresh location button
    refreshLocationBtn.addEventListener('click', function() {
        // Show loading indicator
        emergencyLocation.value = "Detecting your location...";
        this.classList.add('rotating');
        
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    
                    // Get address from coordinates (reverse geocoding)
                    // In a real app, this would use a geocoding service
                    // For demo purposes, we'll use a placeholder
                    const address = "123 Main Street, Tirupati, Andhra Pradesh 517501";
                    
                    // Update emergency location input
                    emergencyLocation.value = address;
                    
                    // Stop rotation
                    refreshLocationBtn.classList.remove('rotating');
                },
                function(error) {
                    console.error('Geolocation error:', error);
                    
                    // Update emergency location input
                    emergencyLocation.value = "Location not available";
                    
                    // Stop rotation
                    refreshLocationBtn.classList.remove('rotating');
                }
            );
        } else {
            // Geolocation not supported
            emergencyLocation.value = "Location not available";
            
            // Stop rotation
            refreshLocationBtn.classList.remove('rotating');
        }
    });
    
    // Cancel emergency button
    if (cancelEmergencyBtn) {
        cancelEmergencyBtn.addEventListener('click', function() {
            closeModal(emergencyModal);
        });
    }
    
    // Submit emergency button
    if (submitEmergencyBtn) {
        submitEmergencyBtn.addEventListener('click', function() {
            // Validate form
            if (emergencyType.value === '') {
                alert('Please select an emergency type');
                return;
            }
            
            // Close emergency modal
            closeModal(emergencyModal);
            
            // Generate random ETA
            const minEta = 5;
            const maxEta = 15;
            const eta = Math.floor(Math.random() * (maxEta - minEta + 1)) + minEta;
            if (etaTime) etaTime.textContent = `${eta} minutes`;
            
            // Show confirmation modal
            setTimeout(function() {
                openModal(confirmationModal);
                
                // Simulate ambulance movement
                simulateAmbulanceMovement();
                
                // Notify emergency contacts
                notifyEmergencyContacts();
            }, 500);
            
            // In a real app, this would send the request to the server
            console.log({
                location: emergencyLocation.value,
                type: emergencyType.value,
                details: emergencyDetails.value
            });
        });
    }
    
    // Call driver button
    if (callDriverBtn) {
        callDriverBtn.addEventListener('click', function() {
            // In a real app, this would initiate a phone call
            alert('Calling driver...');
        });
    }
    
    // Close confirmation button
    if (closeConfirmationBtn) {
        closeConfirmationBtn.addEventListener('click', function() {
            closeModal(confirmationModal);
        });
    }
    
    // Helpline button
    if (helplineBtn) {
        helplineBtn.addEventListener('click', function() {
            // In a real app, this would initiate a phone call to emergency services
            alert('Calling emergency helpline...');
        });
    }
    
    // Contact action buttons
    if (contactActionBtns) {
        contactActionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.getAttribute('title');
                if (action === 'Call contact') {
                    alert('Calling contact...');
                } else if (action === 'Edit contact') {
                    alert('Edit contact feature would open in a real app');
                }
            });
        });
    }
    
    // Add contact card
    if (addContactCard) {
        addContactCard.addEventListener('click', function() {
            alert('Add contact form would open in a real app');
        });
    }
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            
            if (modal === videoCallModal) {
                endVideoCall();
            }
            
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            if (e.target === videoCallModal) {
                endVideoCall();
            }
            
            closeModal(e.target);
        }
    });
    
    // Video call controls
    if (controlBtns) {
        controlBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                const icon = this.querySelector('i');
                const action = this.getAttribute('title');
                
                if (action === 'Toggle microphone') {
                    if (this.classList.contains('active')) {
                        icon.classList.remove('fa-microphone');
                        icon.classList.add('fa-microphone-slash');
                    } else {
                        icon.classList.remove('fa-microphone-slash');
                        icon.classList.add('fa-microphone');
                    }
                } else if (action === 'Toggle video') {
                    if (this.classList.contains('active')) {
                        icon.classList.remove('fa-video');
                        icon.classList.add('fa-video-slash');
                    } else {
                        icon.classList.remove('fa-video-slash');
                        icon.classList.add('fa-video');
                    }
                } else if (action === 'Chat') {
                    alert('Chat feature would be available in a real app');
                } else if (action === 'Share screen') {
                    alert('Screen sharing would be available in a real app');
                }
            });
        });
    }
    
    if (endCallBtn) {
        endCallBtn.addEventListener('click', function() {
            endVideoCall();
        });
    }
    
    // Start video call
    function startVideoCall() {
        // Reset UI
        muteBtn.classList.remove('active');
        videoCamBtn.classList.remove('active');
        chatBtn.classList.remove('active');
        shareBtn.classList.remove('active');
        
        muteBtn.querySelector('i').className = 'fas fa-microphone';
        videoCamBtn.querySelector('i').className = 'fas fa-video';
        
        // Start call timer
        let seconds = 0;
        let minutes = 0;
        callTimerInterval = setInterval(function() {
            seconds++;
            
            if (seconds === 60) {
                seconds = 0;
                minutes++;
            }
            
            callTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
        
        // Simulate connection delay
        setTimeout(function() {
            // Show doctor video
            const remoteStream = document.querySelector('.remote-stream');
            remoteStream.innerHTML = `
                <div class="remote-stream-video">
                    <img src="https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg" alt="Doctor">
                </div>
                <div class="remote-info">
                    <span class="remote-name">Dr. Sarah Johnson</span>
                </div>
            `;
            
            // Show local video
            const localStream = document.querySelector('.local-stream');
            localStream.innerHTML = `
                <div class="local-stream-video">
                    <img src="https://ui-avatars.com/api/?name=John+Doe&background=4e54c8&color=fff&size=200" alt="You">
                </div>
            `;
        }, 3000);
    }
    
    // End video call
    function endVideoCall() {
        // Reset call timer
        if (callTimer) {
            callTimer.textContent = '00:00';
        }
        
        // Reset video call UI
        if (mainVideoStream) {
            mainVideoStream.innerHTML = `
                <div class="connecting-indicator">
                    <div class="spinner"></div>
                    <p>Connecting to doctor...</p>
                </div>
                <div class="doctor-info">
                    <span>Dr. Sarah Johnson</span>
                    <span>Emergency Medicine</span>
                </div>
            `;
        }
        
        // Reset control buttons
        if (controlBtns) {
            controlBtns.forEach(btn => {
                btn.classList.remove('active');
                const icon = btn.querySelector('i');
                const action = btn.getAttribute('title');
                
                if (action === 'Toggle microphone') {
                    icon.className = 'fas fa-microphone';
                } else if (action === 'Toggle video') {
                    icon.className = 'fas fa-video';
                }
            });
        }
        
        // Close the video call modal
        closeModal(videoCallModal);
    }
    
    // Simulate ambulance movement
    function simulateAmbulanceMovement() {
        const ambulanceLocation = document.querySelector('.ambulance-location');
        const routeLine = document.querySelector('.route-line');
        
        // Set initial position
        ambulanceLocation.style.top = '80%';
        ambulanceLocation.style.left = '10%';
        
        // Update route line
        updateRouteLine();
        
        // Animate ambulance
        let progress = 0;
        const animationInterval = setInterval(function() {
            progress += 0.01;
            
            if (progress >= 1) {
                clearInterval(animationInterval);
                
                // Show arrival notification
                const notification = document.createElement('div');
                notification.className = 'notification success';
                notification.innerHTML = `
                    <div class="notification-icon">
                        <i class="fas fa-ambulance"></i>
                    </div>
                    <div class="notification-content">
                        <p>Ambulance has arrived at your location!</p>
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
                
                return;
            }
            
            // Calculate new position
            const newTop = 80 - (progress * 30); // Move from bottom to middle
            const newLeft = 10 + (progress * 40); // Move from left to middle
            
            // Update ambulance position
            ambulanceLocation.style.top = `${newTop}%`;
            ambulanceLocation.style.left = `${newLeft}%`;
            
            // Update route line
            updateRouteLine();
            
            // Update ETA
            const remainingMinutes = Math.ceil((1 - progress) * parseInt(etaTime.textContent));
            etaTime.textContent = `${remainingMinutes} minutes`;
        }, 1000);
    }
    
    // Update route line
    function updateRouteLine() {
        const ambulanceLocation = document.querySelector('.ambulance-location');
        const currentLocation = document.querySelector('.current-location');
        const routeLine = document.querySelector('.route-line');
        
        // Get positions
        const ambulanceRect = ambulanceLocation.getBoundingClientRect();
        const currentRect = currentLocation.getBoundingClientRect();
        const mapRect = document.querySelector('.map-placeholder').getBoundingClientRect();
        
        // Calculate center points relative to map
        const ambulanceX = ambulanceRect.left + (ambulanceRect.width / 2) - mapRect.left;
        const ambulanceY = ambulanceRect.top + (ambulanceRect.height / 2) - mapRect.top;
        const currentX = currentRect.left + (currentRect.width / 2) - mapRect.left;
        const currentY = currentRect.top + (currentRect.height / 2) - mapRect.top;
        
        // Calculate distance and angle
        const distance = Math.sqrt(Math.pow(currentX - ambulanceX, 2) + Math.pow(currentY - ambulanceY, 2));
        const angle = Math.atan2(currentY - ambulanceY, currentX - ambulanceX) * (180 / Math.PI);
        
        // Set route line position and rotation
        routeLine.style.width = `${distance}px`;
        routeLine.style.left = `${ambulanceX}px`;
        routeLine.style.top = `${ambulanceY}px`;
        routeLine.style.transform = `rotate(${angle}deg)`;
    }
    
    // Notify emergency contacts
    function notifyEmergencyContacts() {
        // In a real app, this would send notifications to emergency contacts
        console.log('Notifying emergency contacts');
    }
    
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
});
