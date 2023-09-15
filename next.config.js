module.exports = {
  images: {
    domains: ['www.notion.so', 's3-us-west-2.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
}
