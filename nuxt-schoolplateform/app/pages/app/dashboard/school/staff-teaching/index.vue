<script setup lang="ts">
import { useSearchForm } from "~/composables/school/staff-teaching/search";
import { noQueries, tableIndex } from "~/lib/utils";

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  middleware: ["location"],
});

const route = useRoute();
const router = useRouter();

use1EZSeo({
  title: computed(() => {
    let searchTitle = "";
    if (route.query.academic_id) {
      searchTitle = `${route.query.academic_id as string}`;
    }
    if (route.query.staff_id) {
      searchTitle += `-${route.query.staff_id as string}`;
    }
    return searchTitle
      ? `"${searchTitle}" Staff Teaching Results!`
      : `${defaultSeo.title} - Staff Teaching Search`;
  }),
  description:
    "You can manage information about staff teaching in this page to let them use the platform!",
});

const {
  isTableActing,
  fields,
  meta,
  isSubmitting,
  pending,
  asyncLookupData,
  defaultValues,
  searchResults,
  clearForm,
  submitForm,
  nextPage,
  prevPage,
  processedData,
  handleAction,
  searchTerm,
} = useSearchForm(route, router);

await asyncLookupData;
</script>

<template>
  <div class="space-y-4 @container">
    <CustomPageTitle>
      <Icon name="lucide:user-round-check" />
      គ្រប់គ្រងបុគ្គលិកបង្រៀន
    </CustomPageTitle>

    <!-- CREATE & SEARCH Bar -->
    <div
      class="grid items-center gap-4 grid-cols-1 @3xl:grid-cols-[max-content_1fr]"
    >
      <Button as-child class="justify-self-start">
        <NuxtLink
          to="/app/dashboard/school/staff-teaching/create"
          class="flex items-center gap-2"
        >
          <Icon name="lucide:user-round-plus" />បង្កើតព័ត៌មានបុគ្គលិកបង្រៀន
        </NuxtLink>
      </Button>

      <div class="@container">
        <ClientOnly>
          <form
            v-if="defaultValues && Object.values(defaultValues).length > 0"
            class="grid items-center gap-4 grid-cols-1 @sm:grid-cols-2 @xl:grid-cols-[1fr_1fr_0.35fr_0.35fr]"
          >
            <CustomComboboxWithList
              id="academic_id"
              button-class="w-full"
              :options="defaultValues?.academics ?? []"
              placeholder="ជ្រើសរើសឆ្នាំសិក្សា"
              search-placeholder="ជ្រើសរើសឆ្នាំសិក្សា..."
              v-model:model-value="fields.academic_id.model.value"
              v-bind="fields.academic_id.props"
            />
            <CustomComboboxWithList
              id="grade_id"
              button-class="w-full"
              :options="defaultValues?.staffs ?? []"
              placeholder="ជ្រើសរើសបុគ្គលិក"
              search-placeholder="ជ្រើសរើសបុគ្គលិក..."
              v-model:model-value="fields.staff_id.model.value!"
              v-bind="fields.staff_id.props"
            />
            <!-- clear form button -->
            <Button
              :disabled="!meta.valid && noQueries(route)"
              type="button"
              variant="outline"
              @click="clearForm"
            >
              <Icon name="lucide:delete" />សម្អាត
            </Button>

            <!-- submit button -->
            <Button v-if="isSubmitting || pending" variant="secondary" disabled>
              <Icon name="svg-spinners:180-ring-with-bg" />កំពុងស្វែងរក...
            </Button>
            <Button
              v-else
              variant="secondary"
              :disabled="!meta.valid"
              @click="submitForm"
            >
              <Icon name="lucide:search" />ស្វែងរក
            </Button>
          </form>

          <template #fallback>
            <div
              class="grid items-center gap-4 grid-cols-1 @sm:grid-cols-2 @xl:grid-cols-[1fr_1fr_0.35fr_0.35fr]"
            >
              <Skeleton class="w-full h-9 bg-secondary/30 border" />
              <Skeleton class="w-full h-9 bg-secondary/30 border" />
              <Skeleton class="w-full h-9 bg-secondary/30 border" />
              <Skeleton class="w-full h-9 bg-secondary/30 border" />
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- search results -->
    <template v-if="searchResults !== null && searchResults !== undefined">
      <div v-if="searchResults!.data.length > 0" class="w-full space-y-4">
        <!-- actual search result -->
        <div class="space-y-4">
          <!-- Filter Input -->
          <div class="w-full max-w-md">
            <Input
              v-model="searchTerm"
              placeholder="ស្វែងរកព័ត៌មានបុគ្គលិកបង្រៀនក្នុងតារាងខាងក្រោម..."
            />
          </div>

          <!-- searched brief info -->
          <div
            class="flex gap-2 flex-wrap justify-center items-center md:justify-between md:gap-0"
          >
            <!-- total school -->
            <p class="text-sm">
              រកឃើញចំនួន
              <span class="text-primary">{{ searchResults!.meta.total }}</span>
              បុគ្គលិកបង្រៀន
            </p>
            <!-- page info -->
            <p class="text-sm">
              ទំព័រ
              <span class="text-primary">{{
                searchResults!.meta.current_page
              }}</span
              >/{{ searchResults!.meta.last_page }} &mdash; មាន
              <span class="text-primary">{{
                searchResults!.meta.per_page
              }}</span>
              បុគ្គលិកបង្រៀន/ទំព័រ
            </p>
          </div>

          <!-- Table -->
          <div class="rounded-md border">
            <Table :class="pending && 'table-loading'">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-25 cursor-pointer">
                    <div class="flex items-center">ល.រ.</div>
                  </TableHead>
                  <TableHead class="w-25 cursor-pointer">
                    <div class="flex items-center">លេខកូដ</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ឆ្នាំសិក្សា</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ឈ្មោះបុគ្គលិក</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ប្រភេទកម្រិតថ្នាក់</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ជួយបង្រៀន</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ប្រធានក្រុមបច្ចេកទេស</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ពីរភាសា</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">បង្រៀនភាសាអង់គ្លេស</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ទទួលបន្ទុកថ្នាក់</div>
                  </TableHead>

                  <TableHead class="text-right">
                    <span class="flex justify-end items-center gap-2">
                      <Icon
                        v-if="isTableActing"
                        name="svg-spinners:180-ring-with-bg"
                      />
                      <span>ផ្សេងៗ</span>
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(eachStaffTeaching, index) in processedData"
                  :key="index"
                  class="*:py-1"
                >
                  <TableCell class="font-medium">{{
                    tableIndex(
                      toRef(searchTerm),
                      index,
                      searchResults?.meta?.current_page,
                      searchResults?.meta?.per_page
                    )
                  }}</TableCell>
                  <TableCell>{{ eachStaffTeaching.teaching_id }}</TableCell>
                  <TableCell>{{ eachStaffTeaching.academic_id }}</TableCell>
                  <TableCell>{{ eachStaffTeaching.staff_id }}</TableCell>
                  <TableCell>{{ eachStaffTeaching.cgt_id }}</TableCell>
                  <TableCell>
                    <LazyCustomActiveRow
                      :condition="eachStaffTeaching.add_teaching"
                    />
                  </TableCell>
                  <TableCell>
                    <LazyCustomActiveRow
                      :condition="eachStaffTeaching.chief_technical"
                    />
                  </TableCell>
                  <TableCell>
                    <LazyCustomActiveRow
                      :condition="eachStaffTeaching.bi_language"
                    />
                  </TableCell>
                  <TableCell>
                    <LazyCustomActiveRow
                      :condition="eachStaffTeaching.teach_english"
                    />
                  </TableCell>
                  <TableCell>
                    <LazyCustomActiveRow
                      :condition="eachStaffTeaching.class_incharge"
                    />
                  </TableCell>

                  <TableCell class="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="sm" class="py-0">
                          <Icon name="bi:three-dots" class="h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          @click="handleAction('EDIT', eachStaffTeaching)"
                        >
                          កែប្រែព័ត៌មាន
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          @click="handleAction('DELETE', eachStaffTeaching)"
                        >
                          លុបព័ត៌មាន
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <!-- pagination -->
        <div class="flex items-center justify-between">
          <Button
            @click="prevPage"
            :disabled="!!!searchResults!.links.prev_page_url || pending"
            variant="outline"
            >{{
              pending ? "កំពុងដំណើរការ..." : "&leftarrow; ទំព័រខាងក្រោយ"
            }}</Button
          >
          <Button
            @click="nextPage"
            :disabled="!!!searchResults!.links.next_page_url || pending"
            variant="outline"
            >{{
              pending ? "កំពុងដំណើរការ..." : "ទំព័រខាងមុខ &rightarrow;"
            }}</Button
          >
        </div>
      </div>
      <div
        v-else-if="searchResults!.data.length === 0"
        class="flex justify-center items-center"
      >
        <p class="italic text-primary font-bold sm:text-xl">
          មិនមែនព័ត៌មាននៅក្នុងប្រព័ន្ធ!
        </p>
      </div>
    </template>
  </div>
</template>
