interface CalculateExercises {
  dailyHours: Array<number>,
  target: number
}

const parseExerciseArguments = (args: Array<string>): CalculateExercises => {
  if (args.length < 4) throw new Error('Not enough arguments');

  if (args.slice(2).map(arg => Number(arg)).every(n => !isNaN(n))) {
    return {
      dailyHours: args.slice(3).map(n => Number(n)),
      target: Number(args[2])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

interface ExerciseData {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

export const calculateExercises = (dailyHours: Array<number>, target: number): ExerciseData => {
  const numberOfDays = dailyHours.length;
  const numberOfTrainingDays = dailyHours.filter(day => day > 0).length;
  const sumOfHours = dailyHours.reduce((s, i) => s + i, 0);
  const averageDailyTime = sumOfHours / numberOfDays;
  const targetReached = averageDailyTime > target;

  const ratingMetric = 0.5; //30 mins less than average
  let rating = 1; //initialize value

  if (averageDailyTime >= target) {
    rating = 3;
  }
  else if (averageDailyTime >= target - ratingMetric) {
    rating = 2;
  }

  let ratingDescription = '';
  if (rating == 3) {
    ratingDescription = 'Amazing, you met your target';
  }
  else if (rating == 2) {
    ratingDescription = 'Not too bad, but could be better';
  }
  else {
    ratingDescription = 'Aw, better work on getting those hours up';
  }

  return (
    {
      periodLength: numberOfDays,
      trainingDays: numberOfTrainingDays,
      success: targetReached,
      rating,
      ratingDescription,
      target,
      average: averageDailyTime
    }
  );
};

//console.log(JSON.stringify(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2)));

try {
  const { dailyHours, target } = parseExerciseArguments(process.argv);
  console.log(JSON.stringify(calculateExercises(dailyHours, target)));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}