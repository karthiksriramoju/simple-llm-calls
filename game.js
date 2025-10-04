
import readline from 'readline';
import random from 'crypto';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function playGame() {
  console.log('\n🎮 Welcome to the Number Guessing Game! 🎮');
  console.log('=====================================');
  console.log('I\'m thinking of a number between 1 and 100.');
  console.log('Can you guess what it is?\n');

  const secretNumber = generateRandomNumber(1, 100);
  let attempts = 0;
  let hasGuessed = false;

  while (!hasGuessed) {
    const guess = await askQuestion('Enter your guess (1-100): ');
    attempts++;

    const userGuess = parseInt(guess);

    if (isNaN(userGuess)) {
      console.log('❌ Please enter a valid number!\n');
      continue;
    }

    if (userGuess < 1 || userGuess > 100) {
      console.log('❌ Please enter a number between 1 and 100!\n');
      continue;
    }

    if (userGuess === secretNumber) {
      console.log(`\n🎉 Congratulations! You guessed the number ${secretNumber} correctly!`);
      console.log(`🏆 It took you ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}!`);
      hasGuessed = true;
    } else if (userGuess < secretNumber) {
      console.log('📈 Too low! Try a higher number.\n');
    } else {
      console.log('📉 Too high! Try a lower number.\n');
    }
  }

  const playAgain = await askQuestion('\nWould you like to play again? (yes/no): ');
  
  if (playAgain.toLowerCase() === 'yes' || playAgain.toLowerCase() === 'y') {
    console.log('\nStarting a new game...\n');
    await playGame();
  } else {
    console.log('\n👋 Thanks for playing! Goodbye!');
    rl.close();
  }
}

// Handle Ctrl+C to exit gracefully
rl.on('SIGINT', () => {
  console.log('\n\n👋 Game interrupted. Goodbye!');
  rl.close();
  process.exit(0);
});

// Start the game
playGame().catch(error => {
  console.error('An error occurred:', error);
