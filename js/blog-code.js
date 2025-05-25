/**
 * Blog Code Copy Functionality
 * Enables copying code blocks to clipboard with visual feedback
 * Adds expandable functionality for long code blocks
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize code containers
    initializeCodeContainers();
    
    // Setup copy buttons
    setupCopyButtons();
});

function initializeCodeContainers() {
    const codeContainers = document.querySelectorAll('.code-container');
    
    codeContainers.forEach(container => {
        const codeElement = container.querySelector('code');
        
        // Wrap code in pre element if not already wrapped
        if (codeElement && codeElement.parentElement.tagName !== 'PRE') {
            const preElement = document.createElement('pre');
            codeElement.parentNode.insertBefore(preElement, codeElement);
            preElement.appendChild(codeElement);
        }
        
        // Check if code is long enough to need expansion
        const codeHeight = codeElement.scrollHeight;
        if (codeHeight > 200) {
            container.classList.add('expandable', 'collapsed');
            
            // Create expand button
            const expandBtn = document.createElement('button');
            expandBtn.className = 'expand-btn';
            expandBtn.textContent = 'Show More';
            expandBtn.style.display = 'block';
            container.appendChild(expandBtn);
            
            // Toggle expand/collapse
            expandBtn.addEventListener('click', function() {
                if (container.classList.contains('collapsed')) {
                    container.classList.remove('collapsed');
                    this.textContent = 'Show Less';
                } else {
                    container.classList.add('collapsed');
                    this.textContent = 'Show More';
                }
            });
        }
        
        // Apply syntax highlighting if available
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(codeElement);
        }
    });
}

function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-container').querySelector('code');
            const successMessage = this.nextElementSibling;
            
            // Copy text to clipboard using modern API if available
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                    showSuccessMessage(successMessage);
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = codeBlock.textContent;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    showSuccessMessage(successMessage);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
                
                document.body.removeChild(textArea);
            }
        });
    });
}

function showSuccessMessage(element) {
    // Show success message
    element.style.display = 'inline-block';
    
    // Hide message after 2 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 2000);
}