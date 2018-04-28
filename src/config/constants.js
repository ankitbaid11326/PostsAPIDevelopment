const devConfig = {
    MONGO_URL : 'mongodb://localhost:27017/makenodejsapi-dev',
    JWT_SECRET: 'devSecret',
};

const testConfig = {
    MONGO_URL : 'mongodb://localhost:27017/makenodejsapi-test',
};

const prodConfig = {
    MONGO_URL : '',
    JWT_SECRET: 'shinigami',
};

const defaultConfig = {
    PORT : process.env.PORT || 3000
};

function envConfig(env) {
    switch(env){
        case 'development':
            return devConfig;
        case 'test':
            return testConfig;
        default:
            return prodConfig;
    }
}


export default{
    ...defaultConfig,
    ...envConfig(process.env.NODE_ENV),
};
