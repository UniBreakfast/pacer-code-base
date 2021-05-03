import { SplitView } from './SplitView.js'

const options = {
  // direction: 'column',
  // padding: 0,
  // borderWidth: 2,
  // borderRadius: 20,
}
const splitView = new SplitView(document.body, options)

window.splitView = splitView

const [sect1, _, sect2] = splitView.el.children

sect1.innerText = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis commodi architecto qui cupiditate adipisci? Quidem facilis vel natus deleniti ex excepturi aperiam esse veritatis delectus deserunt eum accusamus porro qui explicabo, repellat officiis, aliquam animi. Beatae reprehenderit exercitationem, impedit animi nihil nemo veniam minus officiis corporis quisquam, in molestiae fugit perferendis ratione quis reiciendis distinctio sed nobis labore aut blanditiis! Obcaecati, nam, libero alias sint nostrum consequatur doloremque nobis deserunt inventore ab aspernatur, laudantium repellat corrupti hic repellendus commodi fuga similique quos soluta consequuntur facere ex eos neque. Officia dicta ex eius aliquid. Reprehenderit nihil quas, nisi rerum fuga incidunt? Nesciunt debitis magnam possimus ipsa quo accusantium earum asperiores facere distinctio delectus in doloremque dignissimos commodi voluptatem obcaecati eaque temporibus, explicabo perspiciatis dicta quidem excepturi dolore. Cum vero non placeat! Nesciunt nihil sint saepe provident, non maiores et optio laborum dolorem reiciendis quibusdam sunt eos suscipit laudantium dolorum beatae minus ratione? Repellat, doloribus eius? Beatae quis eaque in cum quos officia quisquam explicabo dolor hic libero vel vitae voluptatem, laboriosam, quasi earum, non aut tempore tempora. Cupiditate cum vitae voluptatum aspernatur nisi harum voluptatem, iure voluptatibus quas dolore nesciunt error facilis ex iste quod, vero asperiores culpa, neque ipsum. Excepturi! '.repeat(2)
sect2.innerText = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi similique soluta, error numquam obcaecati non consequatur recusandae, consectetur unde quasi odio illum odit nostrum ipsum iste, rem perferendis. Quasi repellat eos obcaecati beatae laborum eaque enim est. Et hic iure minima quidem? Possimus nesciunt odio cumque unde voluptates magni similique maxime sint debitis dolore inventore, temporibus sed placeat aperiam at corrupti rem sit provident magnam consectetur fugit! Quis explicabo et nemo dolores adipisci consequatur id molestiae sint optio illum! Placeat vel obcaecati rem eum vitae, eligendi sequi suscipit sit dolor debitis, eveniet voluptatem consequuntur optio odio asperiores corporis. Quibusdam aspernatur sapiente magni nulla ab impedit explicabo accusamus, tempore delectus! Expedita, blanditiis cum. Atque fugiat temporibus quod pariatur amet sequi laboriosam! Possimus, quaerat illum? Voluptatibus eligendi vel cumque ex nihil officiis commodi obcaecati enim impedit iusto fugiat libero perferendis in autem numquam, nemo est facere. Officiis dolorem dicta id esse maxime perspiciatis dolor rerum quibusdam vero! Velit pariatur quia nihil possimus. '.repeat(2)
