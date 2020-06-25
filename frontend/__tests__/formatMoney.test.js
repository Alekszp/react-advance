import formatMoney from '../lib/formatMoney'

describe('format money function',()=>{
    it('works with fractional dollars', ()=>{
        expect(formatMoney(1)).toEqual('$0.01')
        expect(formatMoney(15)).toEqual('$0.15')
        expect(formatMoney(80)).toEqual('$0.80')
        expect(formatMoney('1')).toEqual('$0.01')
    })
    it('leave cents off for whole dollars', ()=>{
        expect(formatMoney(100)).toEqual('$1')
        expect(formatMoney(2000)).toEqual('$20')
        expect(formatMoney(80000)).toEqual('$800')
        expect(formatMoney(100000)).toEqual('$1,000')
    })
    it('works with whole and fractional dollars', ()=>{
        expect(formatMoney(104)).toEqual('$1.04')
        expect(formatMoney(2040)).toEqual('$20.40')
        expect(formatMoney(80025)).toEqual('$800.25')
        expect(formatMoney(100004)).toEqual('$1,000.04')
    })
})