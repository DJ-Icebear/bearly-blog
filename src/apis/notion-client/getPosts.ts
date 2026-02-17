import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"
import { Block, ExtendedRecordMap } from "notion-types"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
  let pageId = CONFIG.notionConfig.pageId as string
  const api = new NotionAPI()

  const response = await api.getPage(pageId)
  pageId = idToUuid(pageId)
  const collection = Object.values(response.collection)[0]?.value
  const block = response.block

  //@ts-ignore wrong in type definitions from notion-types
  const schema = collection.value.schema

  let rawMetaData = block[pageId].value
  
  //@ts-ignore wrong in type definitions from notion-types
  rawMetaData = rawMetaData.value as Block

  // Check Type
  if (
    rawMetaData?.type !== "collection_view_page" &&
    rawMetaData?.type !== "collection_view"
  ) {
    return []
  } else {
    // Construct Data
    const pageIds = getAllPageIds(response)
    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]

      const properties = (await getPageProperties(id, block, schema)) || null
      // Add fullwidth, createdtime to properties
      properties.createdTime = new Date(
        block[id].value?.created_time
      ).toString()
      properties.fullWidth =
        (block[id].value?.format as any)?.page_full_width ?? false

      data.push(properties)
    }

    // Sort by date
    data.sort((a: any, b: any) => {
      const dateA: any = new Date(a?.date?.start_date || a.createdTime)
      const dateB: any = new Date(b?.date?.start_date || b.createdTime)
      return dateB - dateA
    })

    const posts = data as TPosts
    return posts
  }
}
