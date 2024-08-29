<template>
  <div class="read-detail-container">
    <div class="title">单元测试</div>

    <div class="editor-content-view preview">
      <p> &nbsp; &nbsp; &nbsp;
        &nbsp;在写代码的时候，有时候完成了一个函数，肯定要测试一下写的到底对不对，在没学单元测试前肯定是把新写的函数放到main函数里面去，然后可能会把不相关的代码给注释掉，在项目很小的时候没问题，但一旦项目大起来了之后这样会很麻烦，还有一点很重要的就是有时候我们测试必须得在生产环境下进行（有些第三方api是只开放给生产环境的，或者一些比如上千万级的数据在本地是没有的），这种时候我们要直接改main函数是很危险的，而且改了main函数再运行需要先停止之前的服务，当然也可以新起服务之类的来搞定，总之这样测试是很麻烦的，这个时候就需要单元测试了。
      </p>
      <p> &nbsp; &nbsp; &nbsp; &nbsp;假设有一文件<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>a.go</code></span>里有一函数<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>Hello</code></span>，要测试的话就需要在<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>a.go</code></span>文件的同级目录下新建一文件<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>a_test.go</code></span>（一般以原文件名在后面加<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>_test</code></span>作为名字，注意必须以<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>_test</code></span>结尾），再在里面新建一个函数名为<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>TestHello</code></span>（一般以原函数名在前面加<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>Test</code></span>作为名字，后面是什么并没有强行要求，但是<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>Test</code></span>必须打头，后面的xxx首字母必须大写，该函数形参类型固定为<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>*testing.T</code></span>），在该函数内调用原函数，并判断，若正确则使用<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>t.Logf</code></span>，若错误则使用<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>t.Fatalf</code></span>。</p>
      <p> &nbsp; &nbsp; &nbsp; &nbsp;要测试文件需要使用<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>go test</code></span>命令。为什么这里可以直接运行而不经过main函数？因为这是go的testing框架会将相关的文件及代码导入一个内部的main函数来测试。在xxx_test.go的目录下使用go
        test会测试该目录下所有以<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>_test.go</code></span>结尾的文件，要测试单个文件的话是<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>go test xxx_test.go soucer1.go source2.go</code></span>（<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>source.go</code></span>是测试文件中导入的包那些文件），要测试单个函数的话是<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>go test -test.run FunctionName</code></span>，执行命令后若有错误才会显示日志，要想在正确时也显示日志需要带上<span
          style="background-color: rgba(0, 0, 0, 0.06);"><code>-v</code></span>参数。</p>
      <pre><code class="language-go">package calc

func Add(a, b int) int {
	return a + b
}</code></pre>
      <pre><code class="language-go">package calc

import "testing"

func TestAdd(t *testing.T) {
	if Add(5, 10) == 15 {
		t.Logf("right")
	} else {
		t.Fatalf("wrong")
	}
}</code></pre>
      <pre><code class="language-go">package calc

func Sub(a, b int) int {
	return a - b
}</code></pre>
      <pre><code class="language-go">package calc

import "testing"

func TestSub(t *testing.T) {
   if Sub(5, 10) == -5 {
      t.Logf("right")
   } else {
      t.Fatalf("wrong")
   }
}</code></pre>
      <p><img src="https://cdn.qianshi.fun/read/eba8061e-04b6-42bf-9dcf-a714b1c43257-2.png" alt="" data-href=""
          style="width: 50%;" /></p>
      <p>测试单个文件：</p>
      <p><img src="https://cdn.qianshi.fun/read/854c4c0c-c4d0-42fe-8845-ca37f10bd9ee-2.png" alt="" data-href=""
          style="width: 50%;" /></p>
      <p>测试当前目录下所有文件：</p>
      <p><img src="https://cdn.qianshi.fun/read/e9e6df70-8d19-417d-8d16-7deeec742d1b-2.png" alt="" data-href=""
          style="width: 50%;" /></p>
      <p>测试单个函数：</p>
      <p><img src="https://cdn.qianshi.fun/read/7aac2ae6-a11c-427a-b6e1-203f5cb2eac7-2.png" alt="" data-href=""
          style="width: 50%;" /></p>
    </div>

    <CommentArea :total="0" :totalTop="0" :data="[]" :vid="0" :authorUid="0" :incrTotal="() => { }"
      :incrTotalTop="() => { }" style="margin-top: 20px;"></CommentArea>
  </div>
</template>

<script setup lang="ts">
import CommentArea from "@/components/common/CommentArea.vue"
</script>

<style lang="less" scoped>
.read-detail-container {
  width: 1140px;
  margin-top: 77px;
  margin-bottom: 20px;
  margin-inline: auto;

  .title {
    font-size: 30px;
    margin-bottom: 20px;
  }
}
</style>