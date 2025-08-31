import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { generate } from 'openapi-typescript-codegen'

const SPEC_URL = process.env.API_SPEC_URL || 'https://petstore3.swagger.io/api/v3/openapi.json'
const OUTPUT_DIR = path.resolve('src/shared/api/generated')
const TMP_SPEC = path.resolve('tmp/openapi.json')

execSync(`mkdir -p ${path.dirname(TMP_SPEC)}`)
execSync(`curl -s ${SPEC_URL} -o ${TMP_SPEC}`)

await generate({
    input: TMP_SPEC,
    output: OUTPUT_DIR,
    httpClient: 'axios',
    useOptions: true,
    exportCore: true,
    exportServices: true,
    exportModels: true,
})

const spec = JSON.parse(fs.readFileSync(TMP_SPEC, 'utf-8'))
const resources = []
for (const route of Object.keys(spec.paths)) {
    const match = route.match(/^\/([^\/]+)$/)
    if (!match) continue
    const name = match[1]
    const idPathReg = new RegExp(`^/${name}/\\{`)
    if (!Object.keys(spec.paths).some((p) => idPathReg.test(p))) continue
    let type = 'any'
    const detailPath = Object.keys(spec.paths).find((p) => idPathReg.test(p) && spec.paths[p].get)
    if (detailPath) {
        const schema =
            spec.paths[detailPath].get?.responses?.['200']?.content?.['application/json']?.schema
        if (schema?.$ref) type = schema.$ref.split('/').pop()
    }
    resources.push({ name, type })
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
let content = `/* eslint-disable */\nimport { apiClient } from '@/lib/axios';\nimport { createCrudApi } from '../crudFactory';\nimport { createCrudHooks } from '../useCrudQueries';\n`
for (const r of resources) {
    if (r.type !== 'any') {
        content += `import type { ${r.type} } from './models/${r.type}';\n`
    }
}
content += '\n'
for (const r of resources) {
    const Type = r.type !== 'any' ? r.type : 'any'
    const cap = capitalize(r.name)
    content += `const ${r.name}Api = createCrudApi<${Type}, ${Type}, Partial<${Type}>>(apiClient, '/${r.name}');\n`
    content += `export const { useList: use${cap}List, useDetail: use${cap}Detail, useCreate: use${cap}Create, useUpdate: use${cap}Update, useDelete: use${cap}Delete } = createCrudHooks<${Type}, ${Type}, Partial<${Type}>>('${r.name}', ${r.name}Api);\n\n`
}
fs.writeFileSync(path.join(OUTPUT_DIR, 'hooks.ts'), content)
