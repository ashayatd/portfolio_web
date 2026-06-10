export const magicAnimationRanges = {
  introBuilding: {
    opacityInput: [0, 0.18, 0.28],
    opacityOutput: [1, 1, 0],
    yInput: [0.22, 0.42],
    yOutput: [0, -220],
    scaleInput: [0.22, 0.42],
    scaleOutput: [1, 0.52],
  },
  introSupportingTitles: {
    opacityInput: [0, 0.18, 0.28],
    opacityOutput: [1, 1, 0],
    scalableYInput: [0.22, 0.42],
    scalableYOutput: [0, -20],
    solutionsYInput: [0.22, 0.42],
    solutionsYOutput: [0, -40],
  },

  // Collapse: 3 stacked words → 1 horizontal line
  collapse: {
    // shared scale: large → small
    scaleInput: [0.28, 0.48],
    scaleOutput: [1, 0.22],
    // BUILDING moves up
    buildingYInput: [0.28, 0.48],
    buildingYOutput: [0, -280],
    // SCALABLE stays centered (slight nudge)
    scalableYInput: [0.28, 0.48],
    scalableYOutput: [0, 0],
    // SOLUTIONS moves down
    solutionsYInput: [0.28, 0.48],
    solutionsYOutput: [0, 280],
    // opacity of the collapsed single-line
    lineOpacityInput: [0.28, 0.38, 0.85, 0.95],
    lineOpacityOutput: [0, 1, 1, 0],
  },
  
  buildingHeading: {
    opacityInput: [0.28, 0.42, 0.62, 0.7],
    opacityOutput: [0, 1, 1, 0],
    yInput: [0.28, 0.42, 0.7],
    yOutput: [48, 0, -24],
  },
  scalableHeading: {
    opacityInput: [0.62, 0.72, 0.82, 0.9],
    opacityOutput: [0, 1, 1, 0],
    yInput: [0.62, 0.72, 0.9],
    yOutput: [32, 0, -24],
  },
  solutionsHeading: {
    opacityInput: [0.82, 0.92, 1],
    opacityOutput: [0, 1, 1],
    yInput: [0.82, 0.92],
    yOutput: [32, 0],
  },
  buildingContent: {
    opacityInput: [0.4, 0.54, 0.64, 0.72],
    opacityOutput: [0, 1, 1, 0],
    yInput: [0.4, 0.54, 0.72],
    yOutput: [80, 0, -48],
    scaleInput: [0.4, 0.54, 0.72],
    scaleOutput: [0.97, 1, 0.98],
  },
  scalableContent: {
    opacityInput: [0.62, 0.72, 0.82, 0.9],
    opacityOutput: [0, 1, 1, 0],
    yInput: [0.62, 0.72, 0.9],
    yOutput: [80, 0, -48],
    scaleInput: [0.62, 0.72, 0.9],
    scaleOutput: [0.97, 1, 0.98],
  },
  solutionsContent: {
    opacityInput: [0.82, 0.92, 1],
    opacityOutput: [0, 1, 1],
    yInput: [0.82, 0.92],
    yOutput: [80, 0],
    scaleInput: [0.82, 0.92],
    scaleOutput: [0.97, 1],
  },
  bottomBar: {
    opacityInput: [0, 0.2, 0.38],
    opacityOutput: [1, 1, 0],
  },
  scrollIndicator: {
    opacityInput: [0, 0.16, 0.3],
    opacityOutput: [1, 1, 0],
  },
};
