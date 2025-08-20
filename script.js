
			let start = 0
			let bestTime = Infinity
			let totalTime = 0
			let clickCount = 0
			let gameActive = false
			let isWaiting = false

			// DOM elements
			const shape = document.getElementById('shape')
			const timeTaken = document.getElementById('timeTaken')
			const bestTimeEl = document.getElementById('bestTime')
			const averageTime = document.getElementById('averageTime')
			const totalClicks = document.getElementById('totalClicks')
			const startBtn = document.getElementById('startBtn')
			const resetBtn = document.getElementById('resetBtn')

			// Load stats from localStorage
			function loadStats() {
				if (localStorage.getItem('reactionBestTime')) {
					bestTime = parseFloat(
						localStorage.getItem('reactionBestTime')
					)
					bestTimeEl.innerHTML = bestTime.toFixed(3) + 's'
				}
				if (localStorage.getItem('reactionTotalTime')) {
					totalTime = parseFloat(
						localStorage.getItem('reactionTotalTime')
					)
				}
				if (localStorage.getItem('reactionClickCount')) {
					clickCount = parseInt(
						localStorage.getItem('reactionClickCount')
					)
					totalClicks.innerHTML = clickCount
					updateAverageTime()
				}
			}

			// Save stats to localStorage
			function saveStats() {
				localStorage.setItem('reactionBestTime', bestTime.toString())
				localStorage.setItem('reactionTotalTime', totalTime.toString())
				localStorage.setItem(
					'reactionClickCount',
					clickCount.toString()
				)
			}

			// Initialize the game
			function init() {
				timeTaken.innerHTML = '--'
				loadStats()
				createParticles()
			}

			// Create decorative background particles
			function createParticles() {
				const particleCount = 30
				for (let i = 0; i < particleCount; i++) {
					const particle = document.createElement('div')
					particle.classList.add('particle')

					// Random properties
					const size = Math.random() * 20 + 5
					const x = Math.random() * 100
					const y = Math.random() * 100
					const opacity = Math.random() * 0.5 + 0.1
					const colorHue = Math.random() * 60 + 300 // Purple/pink range

					// Apply styles
					particle.style.width = size + 'px'
					particle.style.height = size + 'px'
					particle.style.left = x + '%'
					particle.style.top = y + '%'
					particle.style.opacity = opacity
					particle.style.background = `hsl(${colorHue}, 80%, 60%)`

					// Add animation with random duration and direction
					const duration = Math.random() * 20 + 15
					const direction =
						Math.random() > 0.5 ? 'clockwise' : 'counterclockwise'
					particle.style.animation = `drift-${direction} ${duration}s linear infinite`

					document.body.appendChild(particle)
				}

				// Add keyframe animations to style
				const style = document.createElement('style')
				style.textContent = `
                @keyframes drift-clockwise {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(${
						window.innerHeight * 1.5
					}px) rotate(360deg); }
                }
                @keyframes drift-counterclockwise {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(${
						window.innerHeight * 1.5
					}px) rotate(-360deg); }
                }
            `
				document.head.appendChild(style)
			}

			function getRandomColor() {
				const letters = '0123456789ABCDEF'
				let color = '#'
				for (let i = 0; i < 6; i++) {
					color += letters[Math.floor(Math.random() * 16)]
				}
				return color
			}

			function makeShapeAppear() {
				if (!gameActive) return

				isWaiting = true

				// Get viewport dimensions
				const maxWidth = window.innerWidth - 200
				const maxHeight = window.innerHeight - 200

				// Random position within viewport
				const top = Math.max(80, Math.random() * (maxHeight - 80))
				const left = Math.random() * maxWidth

				// Random size based on device size
				const isSmallDevice = window.innerWidth <= 600
				const size = isSmallDevice
					? Math.random() * 80 + 80 // 80-160px on mobile
					: Math.random() * 120 + 80 // 80-200px on desktop

				// Random shape (circle or square)
				if (Math.random() > 0.5) {
					shape.style.borderRadius = '50%'
				} else {
					shape.style.borderRadius = '0'
				}

				// Apply styles
				shape.style.backgroundColor = getRandomColor()
				shape.style.width = size + 'px'
				shape.style.height = size + 'px'
				shape.style.top = top + 'px'
				shape.style.left = left + 'px'
				shape.style.display = 'block'

				// Record start time
				start = new Date().getTime()

				// Add a small delay before allowing clicks (prevent cheating)
				setTimeout(() => {
					isWaiting = false
				}, 200)
			}

			function appearAfterDelay() {
				if (!gameActive) return

				// Random delay between 0.8 and 2.5 seconds
				const delay = Math.random() * 1700 + 800
				setTimeout(() => {
					if (gameActive) {
						makeShapeAppear()
					}
				}, delay)
			}

			// Handle shape click
			shape.addEventListener('click', function (e) {
				if (isWaiting || !gameActive) return

				const end = new Date().getTime()
				const reactionTime = (end - start) / 1000

				// Update current time display
				timeTaken.innerHTML = reactionTime.toFixed(3) + 's'

				// Update stats
				clickCount++
				totalClicks.innerHTML = clickCount

				if (reactionTime < bestTime) {
					bestTime = reactionTime
					bestTimeEl.innerHTML = bestTime.toFixed(3) + 's'
				}

				totalTime += reactionTime
				updateAverageTime()

				// Create click effect
				createClickEffect(e)

				// Hide shape and show next one after delay
				shape.style.display = 'none'
				appearAfterDelay()

				// Save stats
				saveStats()
			})

			function createClickEffect(e) {
				const effect = document.createElement('div')
				effect.style.position = 'absolute'
				effect.style.left = e.pageX + 'px'
				effect.style.top = e.pageY + 'px'
				effect.style.width = '10px'
				effect.style.height = '10px'
				effect.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
				effect.style.borderRadius = '50%'
				effect.style.transform = 'translate(-50%, -50%)'
				effect.style.pointerEvents = 'none'
				effect.style.zIndex = '999'
				effect.style.animation = 'clickEffect 0.6s ease-out forwards'

				document.body.appendChild(effect)

				// Add keyframes if not already added
				if (!document.getElementById('clickEffectStyle')) {
					const style = document.createElement('style')
					style.id = 'clickEffectStyle'
					style.textContent = `
                    @keyframes clickEffect {
                        0% { 
                            width: 10px; 
                            height: 10px; 
                            opacity: 0.8; 
                            transform: translate(-50%, -50%) scale(1);
                        }
                        100% { 
                            width: 80px; 
                            height: 80px; 
                            opacity: 0; 
                            transform: translate(-50%, -50%) scale(1.2);
                        }
                    }
                `
					document.head.appendChild(style)
				}

				// Remove effect element after animation
				setTimeout(() => {
					if (document.body.contains(effect)) {
						document.body.removeChild(effect)
					}
				}, 600)
			}

			function updateAverageTime() {
				if (clickCount > 0) {
					const avg = totalTime / clickCount
					averageTime.innerHTML = avg.toFixed(3) + 's'
				}
			}

			// Button event listeners
			startBtn.addEventListener('click', function () {
				if (!gameActive) {
					gameActive = true
					this.innerHTML = '<i class="fas fa-stop"></i> Stop Game'
					appearAfterDelay()
				} else {
					gameActive = false
					shape.style.display = 'none'
					this.innerHTML = '<i class="fas fa-play"></i> Start Game'
				}
			})

			resetBtn.addEventListener('click', function () {
				if (confirm('Reset all statistics? This cannot be undone.')) {
					bestTime = Infinity
					totalTime = 0
					clickCount = 0

					bestTimeEl.innerHTML = '--'
					averageTime.innerHTML = '--'
					totalClicks.innerHTML = '0'

					// Clear localStorage
					localStorage.removeItem('reactionBestTime')
					localStorage.removeItem('reactionTotalTime')
					localStorage.removeItem('reactionClickCount')
				}
			})

			// Initialize on load
			window.onload = init

			// Handle window resize
			window.addEventListener('resize', function () {
				// Update shape if it's visible
				if (
					window.getComputedStyle(shape).display !== 'none' &&
					gameActive
				) {
					const isSmallDevice = window.innerWidth <= 600
					const currentSize = parseInt(shape.style.width)
					const newSize = isSmallDevice
						? Math.min(currentSize, 160)
						: Math.min(currentSize, 200)

					if (currentSize !== newSize) {
						shape.style.width = newSize + 'px'
						shape.style.height = newSize + 'px'
					}
				}
			})
		