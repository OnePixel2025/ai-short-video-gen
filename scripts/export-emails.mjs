import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ConvexHttpClient } from 'convex/browser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

    if (!convexUrl) {
        throw new Error('NEXT_PUBLIC_CONVEX_URL is missing. Add it to your environment (.env.local) before running the export script.')
    }

    const client = new ConvexHttpClient(convexUrl)

    // Fetch all users through the existing Convex query (adjust if you expose a narrower query)
    const users = await client.query('users:getAllUsers')

    // Build a list of rows { name, email } filtering out empty emails
    const rows = []
    const seenEmails = new Set()

    for (const user of users) {
        const email = typeof user?.email === 'string' ? user.email.trim() : ''
        if (!email || seenEmails.has(email)) continue

        seenEmails.add(email)
        rows.push({
            name: typeof user?.name === 'string' ? user.name.trim() : '',
            email
        })
    }

    const header = 'name,email'
    const csvRows = rows.map(({ name, email }) => {
        const safeName = name.includes(',') ? `"${name.replace(/"/g, '""')}"` : name
        const safeEmail = email.includes(',') ? `"${email.replace(/"/g, '""')}"` : email
        return `${safeName},${safeEmail}`
    })

    const csvContent = [header, ...csvRows].join('\n')
    const outputPath = path.join(__dirname, 'users-emails.csv')

    fs.writeFileSync(outputPath, csvContent, 'utf8')

    console.log(`Exported ${rows.length} users to ${outputPath}`)
}

main().catch((error) => {
    console.error('Failed to export users:', error)
    process.exit(1)
})

// To run the script: node --env-file .env.local scripts/export-emails.mjs