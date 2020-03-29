document.addEventListener('DOMContentLoaded', () => {
	const squares = document.querySelectorAll('.grid div');
	const resultDisplay = document.querySelector('#result');
	let width = 15;
	let currentShooterIndex = 202;
	let currentInvaderIndex = 0;
	let alienInvadersTakenDown = [];
	let result = 0;
	let velocity = 1;
	let invaderIntervalId;

	// define the alien invaders
	// prettier-ignore
	let alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
  ];

	// draw the alien invaders
	alienInvaders.forEach((invader) => squares[currentInvaderIndex + invader].classList.add('invader'));

	// draw the shooter
	squares[currentShooterIndex].classList.add('shooter');

	function moveShooter(e) {
		squares[currentShooterIndex].classList.remove('shooter');
		switch (e.keyCode) {
			case 37: // arrow left
				if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
				break;
			case 39: // arrow right
				if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
				break;
		}
		squares[currentShooterIndex].classList.add('shooter');
	}
	document.addEventListener('keydown', moveShooter);

	function moveInvaders() {
		const invadersAreCurrentlyOnLeftEdge = alienInvaders[0] % width === 0;
		const invadersAreCurrentlyOnRightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

		if (
			(invadersAreCurrentlyOnLeftEdge && velocity === -1) ||
			(invadersAreCurrentlyOnRightEdge && velocity === 1)
		) {
			velocity = width;
		} else if (velocity === width) {
			if (invadersAreCurrentlyOnLeftEdge) velocity = 1;
			else velocity = -1;
		}

		for (let i = 0; i <= alienInvaders.length - 1; i++) {
			squares[alienInvaders[i]].classList.remove('invader');
		}

		for (let i = 0; i <= alienInvaders.length - 1; i++) {
			alienInvaders[i] += velocity;
		}

		for (let i = 0; i <= alienInvaders.length - 1; i++) {
			if (!alienInvadersTakenDown.includes(i)) {
				squares[alienInvaders[i]].classList.add('invader');
			}
		}

		// decide whether game is over
		// 1. the case, if invaders crash into shooter
		if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
			resultDisplay.textContent = '🤢 Game Over!';
			squares[currentShooterIndex].classList.add('boom');
			clearInterval(invaderIntervalId);
		}

		// 2. the case, if invaders made their way through all the world (but theoretcially not possible as they'd crash into the shooter before)
		for (let i = 0; i <= alienInvaders.length - 1; i++) {
			if (alienInvaders[i] > squares.length - (width - 1)) {
				resultDisplay.textContent = 'Game Over!';
				clearInterval(invaderIntervalId);
			}
		}

		// decide a win
		if (alienInvadersTakenDown.length === alienInvaders.length) {
			resultDisplay.textContent = 'YOU WIN!! 🎉🎉🎉';
			clearInterval(invaderIntervalId);
		}
	}
	invaderIntervalId = setInterval(moveInvaders, 500);

	function shoot(e) {
		let laserIntervalId;
		let currentLaserIndex = currentShooterIndex; // laser shoots from where the shooter is placed

		// move the laser from the shooter towards the invader 💣
		function moveLaser() {
			squares[currentLaserIndex].classList.remove('laser');
			currentLaserIndex -= 15;
			squares[currentLaserIndex].classList.add('laser');
			if (squares[currentLaserIndex].classList.contains('invader')) {
				squares[currentLaserIndex].classList.remove('laser');
				squares[currentLaserIndex].classList.remove('invader');
				squares[currentLaserIndex].classList.add('boom');

				setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250);
				clearInterval(laserIntervalId);

				const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
				alienInvadersTakenDown.push(alienTakenDown);
				result++;
				resultDisplay.textContent = result;
			}

			//  makes sure the shot does not pass the upper border of the game board, in case invaders of the shot line have already been eliminated
			if (currentLaserIndex < width) {
				clearInterval(laserIntervalId);
				setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
			}
		}

		// finally trigger laser shot but only in case gamer pressed the space key
		if (e.keyCode == 32) laserIntervalId = setInterval(moveLaser, 100);
	}
	document.addEventListener('keyup', shoot);
});
