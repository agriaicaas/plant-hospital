/*
 * @Author: 吴伟 15711376175@163.com
 * @Date: 2025-03-03 19:32:42
 * @LastEditors: 吴伟 15711376175@163.com
 * @LastEditTime: 2025-03-03 21:31:04
 * @FilePath: /ai/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: 吴伟 15711376175@163.com
 * @Date: 2025-03-03 19:32:42
 * @LastEditors: 吴伟 15711376175@163.com
 * @LastEditTime: 2025-03-03 21:19:36
 * @FilePath: /ai/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
