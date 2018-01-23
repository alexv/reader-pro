const dev = {
  cognito: {
    USER_POOL_ID: 'us-east-2_496YOvDZl',
    APP_CLIENT_ID: '3uo5bs812nmhfkbuoprkgbgmsi',
    REGION: 'us-east-2',
    IDENTITY_POOL_ID: 'us-east-2:d9a66f48-39b9-4cbb-a236-0f56a4e0ab99',
  },
  apiGateway: {
    URL: 'https://rey6dybbva.execute-api.us-east-2.amazonaws.com/prod',
    REGION: 'us-east-2',
  },
};

const prod = {
  cognito: {
    USER_POOL_ID: 'us-east-2_496YOvDZl',
    APP_CLIENT_ID: '3uo5bs812nmhfkbuoprkgbgmsi',
    REGION: 'us-east-2',
    IDENTITY_POOL_ID: 'us-east-2:d9a66f48-39b9-4cbb-a236-0f56a4e0ab99',
  },
  apiGateway: {
    URL: 'https://rey6dybbva.execute-api.us-east-2.amazonaws.com/prod',
    REGION: 'us-east-2',
  },
};

const config = process.env.REACT_APP_STAGE === 'production' ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
};
