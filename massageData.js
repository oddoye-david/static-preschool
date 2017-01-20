function massageData(data) {
    let items = data.items.map(item => {
        let newItem = Object.assign({}, item.fields)
        newItem.id = item.sys.id
        newItem.image = 'https:' + data.includes.Asset.filter(asset => {
            return asset.sys.id === newItem.image.sys.id
        })[0].fields.file.url
        return newItem
    })
    return items 
}

module.exports = massageData