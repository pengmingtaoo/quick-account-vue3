import { defineComponent, PropType, reactive, ref } from 'vue'
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../shared/Button';
import { Form, FormItem } from '../shared/Form';
import { Icon } from '../shared/Icon';
import { hasError, validate } from '../shared/validate';
import s from './SignInPage.module.scss';
import { http } from '../shared/Http';
import { useBool } from '../hooks/useBool';
export const SignInPage = defineComponent({
  setup(props, context) {
    const formData = reactive({
        email: '1491614819@qq.com',
        code:'',
    })
    const errors = reactive({
        email: [],
        code:[],
    })
    
    const onSubmit = async (e: Event) => { 
        e.preventDefault()
        Object.assign(errors, {
            email: [],
            code:[]
        })
      Object.assign(errors,validate(formData, [
            {key:'email',type:'required',message:'必填'}, 
            {key:'email',type:'pattern',regex:/.+@.+/,message:'必须是邮箱格式'}, 
            {key:'code',type:'required',message:'必填'}
      ]))
        if (!hasError(errors)) {
         const response = await http.post('/session',formData)
        }
       
    }
    const onError = (error:any) =>{
        if (error.response.status === 422) {
            Object.assign(errors,error.response.data.errors)
        }
        throw error
    }
    const refValidationCode = ref<any>() 
    const {ref:refDisabled, on ,off,toggle} = useBool(false)
    const onClickSendValidationCode = async() => { //发送请求验证码
        on()
        const response = await http
        .post('/validation_codes', { email: formData.email })
        .catch(onError)
        .finally(off)
        //成功
        refValidationCode.value.startCount()
    }
        
      return () =>
          <MainLayout>{
          {
            title:()=>'登录',
            icon: () => <Icon name="return" class={s.return}/>,
            default:()=>
                <div class={s.wrapper}>
                    <div class={s.logo}>
                        <Icon name='mangosteen' class={s.icon}/>
                        <h1 class={s.appName}>山竹记账</h1>
                    </div>
                    <Form onSubmit={onSubmit}>
                        <FormItem label='邮箱地址' type='text' placeholder='请输入邮箱，然后点击发送验证码'
                        v-model={formData.email} error={errors.email?.[0]}></FormItem>
                        <FormItem label='验证码' ref={refValidationCode} type='validationCode' countFrom={5} placeholder='请输入六位数字 '
                        onClick={onClickSendValidationCode} 
                        disabled={refDisabled.value}
                        v-model={formData.code} error={errors.code?.[0]}></FormItem>
                        <FormItem class={s.space}>
                            <Button type='submit'>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            }
          }
          </MainLayout>
    }
})