/**
 * Patient History Page Functionality
 * Handles booking history display, filtering, and interactions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Table and filter elements
    const bookingsTable = document.getElementById('bookings-table');
    const searchInput = document.getElementById('search-bookings');
    const statusFilter = document.getElementById('status-filter');
    const paginationPages = document.querySelectorAll('.pagination-page');
    const prevButton = document.querySelector('.pagination-btn.prev');
    const nextButton = document.querySelector('.pagination-btn.next');
    
    // Modal elements
    const bookingDetailsModal = document.getElementById('booking-details-modal');
    const reviewModal = document.getElementById('review-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Action buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    const editButtons = document.querySelectorAll('.edit-btn');
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    const reviewButtons = document.querySelectorAll('.review-btn');
    const downloadButtons = document.querySelectorAll('.download-btn');
    const rebookButtons = document.querySelectorAll('.rebook-btn');
    
    // Modal action buttons
    const modalActionSecondary = document.getElementById('modal-action-secondary');
    const modalActionPrimary = document.getElementById('modal-action-primary');
    const skipReviewBtn = document.getElementById('skip-review-btn');
    const submitReviewBtn = document.getElementById('submit-review-btn');
    
    // Star rating elements
    const starRatings = document.querySelectorAll('.star-rating');
    
    // Initialize chart
    initBookingsChart();
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        filterTable();
    });
    
    // Status filter
    statusFilter.addEventListener('change', function() {
        filterTable();
    });
    
    // Filter table based on search input and status filter
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value.toLowerCase();
        const rows = bookingsTable.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const bookingId = row.cells[0].textContent.toLowerCase();
            const date = row.cells[1].textContent.toLowerCase();
            const pickup = row.cells[2].textContent.toLowerCase();
            const destination = row.cells[3].textContent.toLowerCase();
            const ambulanceType = row.cells[4].textContent.toLowerCase();
            const hospital = row.cells[5].textContent.toLowerCase();
            const status = row.cells[6].querySelector('.status').textContent.toLowerCase();
            
            const matchesSearch = bookingId.includes(searchTerm) || 
                                 date.includes(searchTerm) || 
                                 pickup.includes(searchTerm) || 
                                 destination.includes(searchTerm) || 
                                 ambulanceType.includes(searchTerm) || 
                                 hospital.includes(searchTerm);
            
            const matchesStatus = statusValue === '' || status.includes(statusValue);
            
            if (matchesSearch && matchesStatus) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Pagination
    paginationPages.forEach(page => {
        page.addEventListener('click', function() {
            // Remove active class from all pages
            paginationPages.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked page
            this.classList.add('active');
            
            // Update prev/next button states
            updatePaginationButtons();
            
            // In a real app, this would load the corresponding page of data
            console.log('Loading page ' + this.textContent);
        });
    });
    
    // Previous page button
    prevButton.addEventListener('click', function() {
        if (!this.disabled) {
            const activePage = document.querySelector('.pagination-page.active');
            const prevPage = activePage.previousElementSibling;
            
            if (prevPage) {
                activePage.classList.remove('active');
                prevPage.classList.add('active');
                updatePaginationButtons();
                
                // In a real app, this would load the previous page of data
                console.log('Loading page ' + prevPage.textContent);
            }
        }
    });
    
    // Next page button
    nextButton.addEventListener('click', function() {
        if (!this.disabled) {
            const activePage = document.querySelector('.pagination-page.active');
            const nextPage = activePage.nextElementSibling;
            
            if (nextPage) {
                activePage.classList.remove('active');
                nextPage.classList.add('active');
                updatePaginationButtons();
                
                // In a real app, this would load the next page of data
                console.log('Loading page ' + nextPage.textContent);
            }
        }
    });
    
    // Update pagination button states
    function updatePaginationButtons() {
        const activePage = document.querySelector('.pagination-page.active');
        
        // Disable prev button if on first page
        prevButton.disabled = !activePage.previousElementSibling;
        
        // Disable next button if on last page
        nextButton.disabled = !activePage.nextElementSibling;
    }
    
    // View booking details
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking');
            
            // In a real app, this would fetch the booking details from the server
            // For demo purposes, we'll use hardcoded data
            const bookingData = getBookingData(bookingId);
            
            // Update modal with booking data
            document.getElementById('modal-booking-id').textContent = bookingData.id;
            document.getElementById('modal-datetime').textContent = bookingData.datetime;
            document.getElementById('modal-pickup').textContent = bookingData.pickup;
            document.getElementById('modal-destination').textContent = bookingData.destination;
            document.getElementById('modal-type').textContent = bookingData.type;
            document.getElementById('modal-status').textContent = bookingData.status;
            document.getElementById('modal-status').className = 'detail-value status ' + bookingData.statusClass;
            document.getElementById('modal-services').textContent = bookingData.services;
            document.getElementById('modal-condition').textContent = bookingData.condition;
            document.getElementById('modal-distance').textContent = bookingData.distance;
            document.getElementById('modal-time').textContent = bookingData.time;
            
            // Update modal actions based on booking status
            if (bookingData.statusClass === 'upcoming') {
                modalActionSecondary.textContent = 'Edit Booking';
                modalActionPrimary.textContent = 'Track Ambulance';
                
                modalActionSecondary.addEventListener('click', function() {
                    window.location.href = 'book-ambulance.html?edit=' + bookingId;
                });
                
                modalActionPrimary.addEventListener('click', function() {
                    // In a real app, this would open a tracking interface
                    alert('Tracking feature would open here');
                });
            } else if (bookingData.statusClass === 'completed') {
                modalActionSecondary.textContent = 'Download Receipt';
                modalActionPrimary.textContent = 'Write Review';
                
                modalActionSecondary.addEventListener('click', function() {
                    // In a real app, this would download a receipt
                    alert('Receipt download would start here');
                });
                
                modalActionPrimary.addEventListener('click', function() {
                    // Close details modal and open review modal
                    closeModal(bookingDetailsModal);
                    openReviewModal(bookingId);
                });
            } else if (bookingData.statusClass === 'cancelled') {
                modalActionSecondary.textContent = 'View Cancellation';
                modalActionPrimary.textContent = 'Rebook';
                
                modalActionSecondary.addEventListener('click', function() {
                    // In a real app, this would show cancellation details
                    alert('Cancellation details would show here');
                });
                
                modalActionPrimary.addEventListener('click', function() {
                    window.location.href = 'book-ambulance.html?rebook=' + bookingId;
                });
            }
            
            // Show modal
            openModal(bookingDetailsModal);
        });
    });
    
    // Edit booking
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking');
            window.location.href = 'book-ambulance.html?edit=' + bookingId;
        });
    });
    
    // Cancel booking
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking');
            
            if (confirm('Are you sure you want to cancel this booking?')) {
                // In a real app, this would send a cancellation request to the server
                alert('Booking ' + bookingId + ' has been cancelled');
                
                // Update the UI to reflect the cancellation
                const row = this.closest('tr');
                const statusCell = row.cells[6].querySelector('.status');
                statusCell.textContent = 'Cancelled';
                statusCell.className = 'status cancelled';
                
                // Update the actions
                const actionsCell = row.cells[7];
                actionsCell.innerHTML = `
                    <div class="action-buttons">
                        <button class="action-btn view-btn" data-booking="${bookingId}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn rebook-btn" data-booking="${bookingId}"><i class="fas fa-redo"></i></button>
                    </div>
                `;
                
                // Reattach event listeners
                actionsCell.querySelector('.view-btn').addEventListener('click', function() {
                    const bookingId = this.getAttribute('data-booking');
                    // View booking code (simplified for brevity)
                    alert('View booking ' + bookingId);
                });
                
                actionsCell.querySelector('.rebook-btn').addEventListener('click', function() {
                    const bookingId = this.getAttribute('data-booking');
                    window.location.href = 'book-ambulance.html?rebook=' + bookingId;
                });
            }
        });
    });
    
    // Review booking
    reviewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking');
            openReviewModal(bookingId);
        });
    });
    
    // Download receipt
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking');
            // In a real app, this would download a receipt
            alert('Downloading receipt for booking ' + bookingId);
        });
    });
    
    // Rebook
    rebookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking');
            window.location.href = 'book-ambulance.html?rebook=' + bookingId;
        });
    });
    
    // Open review modal
    function openReviewModal(bookingId) {
        document.getElementById('review-booking-id').textContent = bookingId;
        
        // Reset star ratings
        starRatings.forEach(ratingContainer => {
            const stars = ratingContainer.querySelectorAll('.fa-star');
            stars.forEach(star => star.classList.remove('active'));
        });
        
        // Reset comment
        document.getElementById('review-comment').value = '';
        
        // Show modal
        openModal(reviewModal);
    }
    
    // Star rating functionality
    starRatings.forEach(ratingContainer => {
        const stars = ratingContainer.querySelectorAll('.fa-star');
        
        stars.forEach(star => {
            // Hover effect
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                // Highlight stars up to the hovered one
                stars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    if (starRating <= rating) {
                        s.classList.add('hover');
                    } else {
                        s.classList.remove('hover');
                    }
                });
            });
            
            // Remove hover effect when mouse leaves the container
            ratingContainer.addEventListener('mouseleave', function() {
                stars.forEach(s => s.classList.remove('hover'));
            });
            
            // Set rating on click
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                // Set active stars
                stars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    if (starRating <= rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    });
    
    // Submit review
    submitReviewBtn.addEventListener('click', function() {
        const bookingId = document.getElementById('review-booking-id').textContent;
        const overallRating = document.querySelector('.star-rating:not(.small) .fa-star.active:last-child');
        const comment = document.getElementById('review-comment').value;
        
        if (!overallRating) {
            alert('Please provide an overall rating');
            return;
        }
        
        const rating = parseInt(overallRating.getAttribute('data-rating'));
        
        // In a real app, this would submit the review to the server
        console.log({
            bookingId: bookingId,
            rating: rating,
            comment: comment
        });
        
        alert('Thank you for your review!');
        closeModal(reviewModal);
    });
    
    // Skip review
    skipReviewBtn.addEventListener('click', function() {
        closeModal(reviewModal);
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
    
    // Initialize bookings chart
    function initBookingsChart() {
        const ctx = document.getElementById('bookings-chart').getContext('2d');
        
        // Sample data - in a real app, this would come from the server
        const chartData = {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [
                {
                    label: 'Bookings',
                    data: [2, 3, 1, 4, 2],
                    backgroundColor: 'rgba(78, 84, 200, 0.2)',
                    borderColor: 'rgba(78, 84, 200, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        };
        
        const chartConfig = {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Monthly Booking Trends'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        };
        
        new Chart(ctx, chartConfig);
    }
    
    // Helper function to get booking data by ID
    function getBookingData(bookingId) {
        // In a real app, this would fetch data from the server
        // For demo purposes, we'll use hardcoded data
        const bookings = {
            'AMB12345': {
                id: 'AMB12345',
                datetime: 'May 19, 2025 - 10:30 AM',
                pickup: '123 Main St, Tirupati',
                destination: 'YMTS Hospital, Tirupati',
                type: 'Basic',
                hospital: 'YMTS Hospital',
                status: 'Upcoming',
                statusClass: 'upcoming',
                services: 'Oxygen Support, Wheelchair',
                condition: 'Stable, requires regular monitoring',
                distance: '5.2 km',
                time: '15 minutes'
            },
            'AMB12346': {
                id: 'AMB12346',
                datetime: 'May 15, 2025 - 09:00 AM',
                pickup: '456 Park Ave, Chennai',
                destination: 'City General Hospital, Chennai',
                type: 'Advanced',
                hospital: 'City General Hospital',
                status: 'Completed',
                statusClass: 'completed',
                services: 'Oxygen Support, Paramedic',
                condition: 'Post-surgery care needed',
                distance: '7.8 km',
                time: '22 minutes'
            },
            'AMB12347': {
                id: 'AMB12347',
                datetime: 'May 10, 2025 - 14:45 PM',
                pickup: '789 Tech Park, Bangalore',
                destination: 'Metro Medical Center, Bangalore',
                type: 'ICU',
                hospital: 'Metro Medical Center',
                status: 'Completed',
                statusClass: 'completed',
                services: 'Full ICU Support, Paramedic Team',
                condition: 'Critical condition, continuous monitoring required',
                distance: '12.3 km',
                time: '35 minutes'
            },
            'AMB12348': {
                id: 'AMB12348',
                datetime: 'May 5, 2025 - 11:15 AM',
                pickup: '321 Lake View, Tirupati',
                destination: 'YMTS Hospital, Tirupati',
                type: 'Basic',
                hospital: 'YMTS Hospital',
                status: 'Cancelled',
                statusClass: 'cancelled',
                services: 'Wheelchair',
                condition: 'Regular checkup',
                distance: '3.7 km',
                time: '10 minutes'
            },
            'AMB12349': {
                id: 'AMB12349',
                datetime: 'May 1, 2025 - 16:30 PM',
                pickup: '567 River Road, Chennai',
                destination: 'City General Hospital, Chennai',
                type: 'Advanced',
                hospital: 'City General Hospital',
                status: 'Completed',
                statusClass: 'completed',
                services: 'Oxygen Support, Stretcher',
                condition: 'Respiratory issues, needs continuous oxygen',
                distance: '9.1 km',
                time: '25 minutes'
            }
        };
        
        return bookings[bookingId] || bookings['AMB12345']; // Default to first booking if ID not found
    }
});
