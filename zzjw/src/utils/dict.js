import useDictStore from '@/store/modules/dict'
import { getDicts } from '@/api/system/dict/data'

export function useDict(...args) {
    const res = ref({});
    return (() => {
        args.forEach((dictType, index) => {
            res.value[dictType] = [];
            const dicts = useDictStore().getDict(dictType);
            if (dicts) {
                res.value[dictType] = dicts;
            } else {
                getDicts(dictType).then(resp => {
                    res.value[dictType] = resp.data.map(p => ({
                        label: p.dictLabel,
                        value: p.dictValue,
                        remark: p.remark,
                        elTagType: p.listClass,
                        elTagClass: p.cssClass
                    }))
                    useDictStore().setDict(dictType, res.value[dictType]);
                })
            }
        })
        return toRefs(res.value);
    })()
}

export function getDictData(type) {
    return new Promise((resolve, reject) => {
        getDicts(type).then(resp => {
            let res = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass }))
            return resolve(res);
        })
            .catch(err => {
                return reject("获取字典[" + type + "]失败");
            })
    })
}
