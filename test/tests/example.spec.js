// @ts-check
import { test, expect } from '@playwright/test';

const webPage = 'http://localhost:5173/'

/**
 * Recomendations on testing
 * 1. -> Roles 
 * 2. -> text labels, placeholders, names
 * 3. -> data-testid
 * 4. -> CSS selectors  
 */
   
test('has title', async ({ page }) => {
  await page.goto(webPage);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Devjobs/);

  const searchInput = page.getByRole('searchbox');
  await searchInput.fill('React');
  await page.getByRole('button', { name: 'Search' }).click()

  const jobsCards = page.locator('.job-listing-card')
  await expect(jobsCards.first()).toBeVisible()

  const firstJobTitle = jobsCards.first().locator('h2')
  await expect(firstJobTitle).toHaveText(/Desarrollador/)
  
  


});
