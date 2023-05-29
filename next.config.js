/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['github.com','s.gravatar.com','uploadthing.com'],
// remotePatterns:[{protocol:'https', hostname:'github.com',port:'',pathname:'*'}]
    },
    typescript: {
        ignoreBuildErrors: true,
    },

}

module.exports = nextConfig
