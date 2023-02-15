/** When your routing table is too long, you can split it into small modules **/

const testRouter = {
  TestIndex: () => import('@/views/test/index'),
  TestTable: () => import('@/views/test/TestTable')
}
export default testRouter
