// 常量定义模版
const constDef = `
{{#each data}}
<h2 id="{{this.content}}" class="mt-0 pt-60">{{this.type}}</h2>
<p><i>{{this.content}}</i></p>
<table
  cellspacing="0"
  cellpadding="0"
  border="0"
  class="el-table el-table--striped el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table-apiTable el-table__header"
  style="margin-bottom:40px"
>
  <colgroup>
    <col width="200" />
    <col width="639" />
  </colgroup>
  <thead class="has-gutter">
    <tr class="">
      <th class="is-center is-leaf">
        <div class="cell">数值</div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">含义</div>
      </th>
    </tr>
  </thead>
  <tbody>
  {{#each this.detail}}
  <tr>
    <td class="is-center">
      {{this.code}}
    </td>
    <td class="is-center">
      {{this.description}}
    </td>
  </tr>
  {{/each}}
  </tbody>
</table>
{{/each}}
`;

// 类型定义模版
const typeDef = `
{{#each data}}
<h2 id="{{this.interface}}" class="mt-0 pt-60"><i>{{this.interface}}</i></h2>
<p>{{this.description}}</p>
{{#mdrender}}<strong>类型：</strong>{{{ this.detail.type }}}{{/mdrender}}
{{#if (isDefined this.detail.multiple)}}
{{#each this.detail.data}}
{{this.title}}
<table
  cellspacing="0"
  cellpadding="0"
  border="0"
  class="el-table el-table--border el-table__header"
>
  <colgroup>
    <col width="140" />
    <col width="85" />
    <col width="690" />
  </colgroup>
  <thead class="has-gutter">
    <tr class="">
      <th class="is-center is-leaf">
        <div class="cell">参数</div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">类型</div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">含义</div>
      </th>
      {{#if (isDefined this.includeMust)}}
      <th class="is-center is-leaf">
        <div class="cell">必传</div>
      </th>
      {{/if}}
    </tr>
  </thead>
  <tbody>
    {{#each this.data}}
      <tr>
        <td class="is-center">{{this.param}}</td>
        <td class="is-center">{{#mdrender}}{{this.type}}{{/mdrender}}</td>
        <td class="is-center">{{#mdrender}}{{{ this.explain }}}{{/mdrender}}</td>
        {{#if (isDefined ../this.includeMust)}}
        <td class="is-center">{{#if (isDefined this.isNeed)}}是{{else}}否{{/if}}</td>
        {{/if}}
      </tr>
    {{/each}}
  </tbody>
</table>

{{/each}}
{{else}}
<table
  cellspacing="0"
  cellpadding="0"
  border="0"
  class="el-table el-table--border el-table__header"
>
  <colgroup>
    <col width="140" />
    <col width="85" />
    <col width="690" />
  </colgroup>
  <thead class="has-gutter">
    <tr class="">
      <th class="is-center is-leaf">
        <div class="cell">参数</div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">类型</div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">含义</div>
      </th>
      {{#if (isDefined this.detail.includeMust)}}
      <th class="is-center is-leaf">
        <div class="cell">必传</div>
      </th>
      {{/if}}
    </tr>
  </thead>
  <tbody>
    {{#each this.detail.data}}
      <tr>
        <td class="is-center">{{this.param}}</td>
        <td class="is-center">{{#mdrender}}{{this.type}}{{/mdrender}}</td>
        <td class="is-center">{{#mdrender}}{{{ this.explain }}}{{/mdrender}}</td>
        {{#if (isDefined ../this.detail.includeMust)}}
        <td class="is-center">{{#if (isDefined this.isNeed)}}是{{else}}否{{/if}}</td>
        {{/if}}
      </tr>
    {{/each}}
  </tbody>
</table>
{{/if}}
{{#if (isDefined this.detail.example)}}
<strong class="mb-5 mt-10 inline-block">示例：</strong>
{{#mdrendercode}}{{{ this.detail.example }}}{{/mdrendercode}}
{{/if}}
{{#if (isDefined this.detail.attent)}}
{{#mdrender}}{{{ this.detail.attent }}}{{/mdrender}}
{{/if}}
{{/each}}
`;

// api接口分类表格
const apiMainsTable = `
<table
cellspacing="0"
cellpadding="0"
border="0"
class="el-table el-table--border el-table-apiTable el-table__header"
>
<colgroup>
  <col width="232" />
  <col width="432" />
</colgroup>
<tbody>
{{#rowspan data}}
    <td class="is-center">
        <a href="{{ this.path }}">{{ this.method }}</a>
    </td>
{{/rowspan}}
</tbody>
</table>
`;

// api接口描述模板
const apiDesc = `
{{#each data}}
<h3 id="{{ this.id }}">{{ this.name }}</h3>
<table
  cellspacing="0"
  cellpadding="0"
  border="0"
  class="el-table el-table--border el-table-apiTable el-table__header"
>
  <colgroup>
    <col width="130" />
    <col width="330" />
    <col width="440" />
  </colgroup>
  <thead class="has-gutter">
    <tr class="">
      <th class="is-center is-leaf">
        <div class="cell">
        类型
        </div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">
        接口
        </div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">描述</div>
      </th>
    </tr>
  </thead>
  <tbody>
      {{#rowspan1 this.data}}
          <td class="is-center">{{ this.description }}</td>
      {{/rowspan1}}
  </tbody>
</table>
{{/each}}
`;
// api接口详情主调参数表格
const paramTableStr = `
<table
  cellspacing="0"
  cellpadding="0"
  border="0"
  class="el-table el-table--border el-table__header"
>
  <colgroup>
    <col width="15%" />
    <col width="10%" />
    <col width="10%" />
    <col width="65%" />
  </colgroup>
  <thead class="has-gutter">
    <tr class="">
      <th class="is-center is-leaf">
        <div class="cell">参数</div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">类型</div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">必传</div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">含义</div>
      </th>
    </tr>
  </thead>
  <tbody>
    {{#each this.detail.data}}
      <tr>
        <td class="is-center">{{this.param}}</td>
        <td class="is-center">{{this.type}}</td>
        <td class="is-center">{{this.necessary}}</td>
        <td class="is-center">{{#mdrender}}{{{ this.explain }}}{{/mdrender}}</td>
      </tr>
    {{/each}}
  </tbody>
</table>`;
// api接口详情回调参数表格
const callbackParamTableStr = `
<table
  cellspacing="0"
  cellpadding="0"
  border="0"
  class="el-table el-table--border el-table__header"
>
  <colgroup>
    <col width="140" />
    <col width="85" />
    <col width="690" />
  </colgroup>
  <thead class="has-gutter">
    <tr class="">
      <th class="is-center is-leaf">
        <div class="cell">参数</div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">类型</div>
      </th>
      <th class="is-center is-leaf">
        <div class="cell">含义</div>
      </th>
    </tr>
  </thead>
  <tbody>
    {{#each this.detail.callbackParam}}
      <tr>
        <td class="is-center">{{this.param}}</td>
        <td class="is-center">{{this.type}}</td>
        <td class="is-center">{{#mdrender}}{{{ this.explain }}}{{/mdrender}}</td>
      </tr>
    {{/each}}
  </tbody>
</table>`;

// api接口详情模版
const apiDetail = `
{{#each data}}
  {{#each this.data}}
  {{#if (isDefined this.id)}}
  <h3 id="{{ this.id }}">{{ this.id }}</h3>
  {{else}}
  <h3 id="{{ this.interface }}">{{ this.interface }}</h3>
  {{/if}}
  <ul>
    <li><strong>详情：</strong><span>{{ this.detail.content }}</span></li>
    <li><strong>描述：</strong><span>{{ this.description }}</span></li>
    {{#if (isDefined this.detail.returnVal)}}
    <li>{{#mdrenderinline}}<strong>返回值：</strong><span>{{{ this.detail.returnVal }}}</span>{{/mdrenderinline}}</li>
    {{/if}}
    {{#if (isDefined this.detail.callback)}}
    <li>{{#mdrenderinline}}<strong>回调：</strong><span>{{{ this.detail.callback }}}</span>{{/mdrenderinline}}</li>
    {{/if}}
    {{#if (isDefined this.detail.data)}}
    <li>
      <strong>参数：</strong>${paramTableStr}
    </li>
    {{/if}}
    {{#if (isDefined this.detail.callbackParam)}}
    <li>
      <strong>回调参数：</strong>${callbackParamTableStr}
    </li>
    {{/if}}
  </ul>
  {{#if (isDefined this.detail.example)}}
  <div>
    <strong class="mb-5 mt-10 inline-block">示例代码：</strong>
    <div class="vue-md-example mb-10">
    {{#mdrendercode}}{{{ this.detail.example }}}{{/mdrendercode}}
    </div>
  </div>
  {{/if}}
  {{#if (isDefined this.detail.attent)}}
  <div>
    <div class="vue-md-attent mt-5 mb-5">
    {{#mdrender}}{{{ this.detail.attent }}}{{/mdrender}}
    </div>
  </div>
  {{/if}}
  {{/each}}
{{/each}}`;

module.exports = {
  constDef,
  typeDef,
  apiMainsTable,
  apiDesc,
  apiDetail,
};
