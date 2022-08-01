const classify = `
<table border=0 cellpadding=0 cellspacing=0 style='border-collapse:collapse;table-layout:fixed;word-wrap:break-word;'>
    <tbody>
        <tr>
            <td style='width:200px;text-align:center' rowspan={{eval "arg[0]+1" notMeetApiList.length}}>房间外接口</td>
        </tr>
        {{#each notMeetApiList}}
            <tr>
                <td style='width:400px;text-align:center'><a href="#{{this.id}}">{{this.title}}</a></td>
            </tr>
        {{/each}}
        <tr>
            <td style='width:200px;text-align:center' rowspan={{eval "arg[0]+1" meetApiList.length}}>房间内接口</td>
        </tr>
        
        {{#each meetApiList}}
            <tr>
                <td style='width:400px;text-align:center'><a href="#{{this.id}}">{{this.title}}</a></td>
            </tr>
        {{/each}}
    </tbody>
</table>
`;
const block = `
{{#with data}}
<h3 id={{id}}>{{title}}</h3>

<table border=0 cellpadding=0 cellspacing=0 style='border-collapse:collapse;table-layout:fixed;word-wrap:break-word;'>
    <thead>
        <tr>
            <th style='width:70px;text-align:center'>
                方式
            </th>
            <th style='width:300px;text-align:center'>
                接口
            </th>
            <th style='width:400px;text-align:center'>
                描述
            </th>
        </tr>
    </thead>
    <tbody>
        {{#if data.quote.length}}
        <tr>
            <td rowspan={{eval "arg[0]+1" data.quote.length}}>引用</td>
        </tr>
        {{#each data.quote}}
        <tr>
            <td><a href="#CRVideo_{{interface}}">{{this.interface}}</a></td>
            <td>{{this.description}}</td>
        </tr>
        {{/each}}
        {{/if}}

        {{#if data.initiative.length}}
        <tr>
            <td rowspan={{eval "arg[0]+1" data.initiative.length}}>主调</td>
        </tr>
        {{#each data.initiative}}
        <tr>
            <td><a href="#CRVideo_{{interface}}">{{this.interface}}</a></td>
            <td>{{this.description}}</td>
        </tr>
        {{/each}}
        {{/if}}

        {{#if data.passive.length}}
        <tr>
            <td rowspan={{eval "arg[0]+1" data.passive.length}}>回调</td>
        </tr>
        {{#each data.passive}}
        <tr>
            <td><a href="#CRVideo_{{interface}}">{{this.interface}}</a></td>
            <td>{{this.description}}</td>
        </tr>
        {{/each}}
        {{/if}}
    </tbody>
</table>
{{/with}}
`;
const desc = `
<h3 id=CRVideo_{{data.interface}}>{{data.interface}}</h3>
{{#mdrender}}
- **详情**: {{data.interface}}{{interfaceParam type data.params}}
- **功能**: {{data.description}}
{{#if (eval "arg[0]==='quote'||arg[0]==='initiative'" type)}}
- **返回值**: {{#if data.returnValue}}{{data.returnValue}}{{else}}无{{/if}}
{{/if}}

{{#if data.params.length}}
| 参数 | 类型 | 说明 |
|:-------- |:-----------|:----------|
{{#each data.params}}
|{{this.param}}|{{this.type}}|{{this.explain}}|
{{/each}}
{{/if}}
{{/mdrender}}
{{#if data.gist}}
{{#mdrender}}
- **补充说明**:

> {{data.gist}}

{{/mdrender}}
{{/if}}
`;
/* 
| 参数 | 取值 | 含义 |
|:-------- |:-----------|:----------|
| NoQueue| 0/1(缺省:0) | 设为1可加快登录速度（适合于不使用sdk的排队功能的业务，如：临柜双录业务、链接入 会业务）|
|Timeout|（缺 省:90000)|网络通信超时时间，单位是毫秒 |
|DatEncType|0/1	(缺省:1) |数据加密类型, 0:不加密(http、udp)，1:加密(https、udp数据des3加密)|
|VerifyHttpsCert|0/1(缺省:1)|是否验证服务器SSL证书（0:不验证，1:验证； 此参数仅在DatEncType为1时此参数才有效）。 如果web服务使用自签名SSL证书此参数应配置为0。|
*/

module.exports = {
  classify,
  block,
  desc,
};
