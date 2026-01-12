<script setup lang="ts">
import { useStaffSearchForm } from "~/composables/staff/useStaffSearchForm";
import { tableIndex, noQueries, formattedDate } from "~/lib/utils";

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  middleware: ["location"],
});

const route = useRoute();
const router = useRouter();

use1EZSeo({
  title: computed(() => {
    return !!route.query.staff_name
      ? `"${route.query.staff_name as string}" Staff Results!`
      : `${defaultSeo.title} - Staff Search`;
  }),
  description:
    "You can set permissions for staffs in this page to let them have level of access to the platform!",
});

const {
  isTableActing,
  fields,
  meta,
  isSubmitting,
  pending,
  searchResults,
  clearForm,
  submitForm,
  nextPage,
  prevPage,
  processedData,
  handleAction,
  searchTerm,
} = useStaffSearchForm(route, router);
</script>

<template>
  <div class="space-y-4 @container">
    <CustomPageTitle>
      <Icon name="lucide:user-round-search" />
      ស្វែងរកព័ត៌មានបុគ្គលិក
    </CustomPageTitle>

    <!-- TWO COLUMNS -->
    <div class="grid gap-4 grid-cols-1 @xl:grid-cols-[1fr_auto]">
      <div class="grid gap-2">
        <Input
          type="text"
          id="staff_name"
          placeholder="សូមបញ្ចូលឈ្មោះបុគ្គលិក ដើម្បីស្វែងរក..."
          v-model:model-value="fields.staff_name.model.value"
          v-bind="fields.staff_name.props"
          @keydown.enter="submitForm"
        />
      </div>

      <div class="flex items-center justify-center gap-4 w-full @xl:w-fit">
        <!-- clear form button -->
        <Button
          :disabled="!meta.valid && noQueries(route)"
          variant="outline"
          @click="clearForm"
        >
          <Icon name="lucide:delete" />សម្អាត
        </Button>
        <!-- submit button -->
        <Button v-if="isSubmitting || pending" disabled>
          <Icon name="svg-spinners:180-ring-with-bg" />កំពុងស្វែងរក...
        </Button>
        <Button v-else :disabled="!meta.valid" @click="submitForm">
          <Icon name="lucide:search" />ស្វែងរក
        </Button>
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
              placeholder="ស្វែងរកព័ត៌មានបុគ្គលិកក្នុងតារាងខាងក្រោម..."
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
              បុគ្គលិក
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
              បុគ្គលិក/ទំព័រ
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
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">អត្តលេខមន្ត្រី</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ឈ្មោះបុគ្គលិក</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ថ្ងៃ ខែ ឆ្នាំកំណើត</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">លេខទូរសព្ទ</div>
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
                  v-for="(staff, index) in processedData"
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
                  <TableCell>{{ staff.payroll_id }}</TableCell>
                  <TableCell>{{ staff.staff_name }}</TableCell>
                  <TableCell>{{ formattedDate(staff.staff_dob) }}</TableCell>
                  <TableCell>{{ staff.staff_phone }}</TableCell>
                  <TableCell class="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="sm" class="py-0">
                          <Icon name="bi:three-dots" class="h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="handleAction('EDIT', staff)">
                          កែប្រែព័ត៌មាន
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          @click="handleAction('DELETE', staff)"
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
            :disabled="!!!searchResults!.links.prev || pending"
            variant="outline"
            >{{
              pending ? "កំពុងដំណើរការ..." : "&leftarrow; ទំព័រខាងក្រោយ"
            }}</Button
          >
          <Button
            @click="nextPage"
            :disabled="!!!searchResults!.links.next || pending"
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
