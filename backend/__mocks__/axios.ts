const axios = jest.requireActual("axios");

module.exports = {
  ...axios,
  create: jest.fn().mockReturnThis(),
};

// const mockAxios = jest.genMockFromModule("axios");

// mockAxios.create = jest.fn(() => mockAxios);

// export default mockAxios;
