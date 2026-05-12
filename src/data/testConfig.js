
export const testConfig = {
  energy: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 25,
    moodThresholds: [20, 40, 60, 80],
  },
  time: {
    min: 0,
    max: 120,
    step: 1,
    defaultValue: 45,
    hourMinutes: 60,
  },
  budget: {
    min: 0,
    max: 20,
    step: 0.5,
    defaultValue: 6,
    labelMaxValues: [0, 5, 10, 15, 20],
  },
  company: {
    defaultValue: 'mix',
  },
}
