import { test as _test, testFilePath } from '../utils'

import { RuleTester } from 'eslint'

const ruleTester = new RuleTester()
    , rule = require('rules/no-cycle')

const error = message => ({ ruleId: 'no-cycle', message })

const test = def => _test(Object.assign(def, {
  filename: testFilePath("./cycles/depth-zero.js")
}))

// describe.only("no-cycle", () => {
ruleTester.run('no-cycle', rule, {
  valid: [
    // this rule doesn't care if the cycle length is 0
    test({ code: 'import foo from "./foo.js"'}),

    test({ code: 'import _ from "lodash"' }),
    test({ code: 'import foo from "@scope/foo"' }),
    test({ code: 'var _ = require("lodash")' }),
    test({ code: 'var find = require("lodash.find")' }),
    test({ code: 'var foo = require("./foo")' }),
    test({ code: 'var foo = require("../foo")' }),
    test({ code: 'var foo = require("foo")' }),
    test({ code: 'var foo = require("./")' }),
    test({ code: 'var foo = require("@scope/foo")' }),
    test({ code: 'var bar = require("./bar/index")' }),
    test({ code: 'var bar = require("./bar")' }),
    test({
      code: 'var bar = require("./bar")',
      filename: '<text>',
    }),
  ],
  invalid: [
    test({
      code: 'import { foo } from "./depth-one"',
      errors: [error("Dependency cycle detected.")]
    }),
    test({
      code: 'import { foo } from "./depth-two"',
      errors: [error("Dependency cycle via ./depth-one:1")]
    }),
    test({
      code: 'import { two } from "./depth-three-star"',
      errors: [error("Dependency cycle via ./depth-two:1=>./depth-one:1")]
    }),
    test({
      code: 'import { bar } from "./depth-three-indirect"',
      errors: [error("Dependency cycle via ./depth-two:1=>./depth-one:1")]
    }),
  ],
})
// })
