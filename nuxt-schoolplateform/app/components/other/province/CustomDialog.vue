<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import z from "zod";

const open = defineModel<boolean>({ default: false });
const submitStatus = defineModel<boolean>("submitStatus", { default: false });
const props = withDefaults(
  defineProps<{
    dialogSchema: any;
    title: string;
    subTitle: string;
    submitText: string;
    submitIcon: string;
    disabledId?: boolean;
    defaultValues?: any;
  }>(),
  {
    title: "បង្កើតខេត្ត/រាជធានីថ្មី",
    subTitle: "សូមបំពេញព័ត៌មានខាងក្រោម ដើម្បីបង្កើតខេត្ត/រាជធានីថ្មី!",
    submitText: "បង្កើត",
    submitIcon: "lucide:map-pin-plus",
    disabledId: false,
    defaultValues: undefined,
  }
);
const emit = defineEmits<{
  submit: [data: any];
}>();

const { user } = useAuth();
const { handleSubmit, meta, errors, defineField } = useForm<
  z.infer<typeof props.dialogSchema>
>({
  initialValues:
    Object.values(props.defaultValues ?? {}).length > 0 && props.defaultValues,
  validationSchema: toTypedSchema(props.dialogSchema),
});
const [proCode, proCodeAttr] = defineField("pro_code");
const [nameEN, nameENAttr] = defineField("name_en");
const [nameKH, nameKHAttr] = defineField("name_kh");
const [Reference, ReferenceAttr] = defineField("Reference");
const [active] = defineField("active");
const activeBoolean = computed<boolean>({
  get: () => active.value === 1,
  set: (val: boolean) => (active.value = val ? 1 : 0),
});
const [createdBy] = defineField("created_by");
const [updatedBy] = defineField("updated_by");
createdBy.value = updatedBy.value = user.value?.id!;

const submitForm = handleSubmit(async (data) => {
  emit("submit", data);
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      class="sm:max-w-106.25 max-h-[calc(100dvh-10%)] overflow-auto scroll-width-thin"
    >
      <form @submit.prevent="submitForm">
        <DialogHeader>
          <DialogTitle>{{ props.title }}</DialogTitle>
          <DialogDescription>
            {{ props.subTitle }}
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="pro_code" class="text-right">លេខកូដ</Label>
            <Input
              id="pro_code"
              placeholder="សូមបំពេញលេខកូដ..."
              type="number"
              class="col-span-3"
              v-model:model-value="proCode"
              v-bind="proCodeAttr"
              :disabled="disabledId"
            />
            <small class="text-red-500">{{ errors.pro_code }}</small>
          </div>
          <div class="grid gap-2">
            <Label for="name_kh" class="text-right">ឈ្មោះជាភាសាខ្មែរ</Label>
            <Input
              id="name_kh"
              placeholder="សូមបំពេញឈ្មោះជាភាសាខ្មែរ..."
              type="text"
              class="col-span-3"
              v-model:model-value="nameKH"
              v-bind="nameKHAttr"
            />
            <small class="text-red-500">{{ errors.name_kh }}</small>
          </div>
          <div class="grid gap-2">
            <Label for="name_en" class="text-right">ឈ្មោះជាអង់គ្លេស</Label>
            <Input
              id="name_en"
              placeholder="សូមបំពេញឈ្មោះជាអង់គ្លេស..."
              type="text"
              class="col-span-3"
              v-model:model-value="nameEN"
              v-bind="nameENAttr"
            />
            <small class="text-red-500">{{ errors.name_en }}</small>
          </div>
          <div class="grid gap-2">
            <Label for="Reference" class="text-right">ឯកសារយោង</Label>
            <Textarea
              id="Reference"
              placeholder="សូមបំពេញឯកសារយោង (ប្រសិនបើមាន)..."
              class="col-span-3 h-full max-h-24 md:h-full md:max-h-36"
              v-model:model-value="Reference"
              v-bind="ReferenceAttr"
            />
          </div>
          <small class="text-red-500">{{ errors.Reference }}</small>
          <div
            class="grid grid-cols-[repeat(2,max-content)] items-center gap-2 grid-flow-col"
          >
            <Label for="active">សកម្ម</Label>
            <Checkbox id="active" v-model:model-value="activeBoolean" />
            <small class="text-red-500">{{ errors.active }}</small>
          </div>
        </div>
        <DialogFooter>
          <Button v-if="submitStatus" disabled>
            <Icon name="svg-spinners:180-ring-with-bg" />
            កំពុង{{ props.submitText }}...
          </Button>
          <Button v-else :disabled="!meta.valid" type="submit">
            <Icon :name="props.submitIcon" />
            {{ props.submitText }}</Button
          >
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
