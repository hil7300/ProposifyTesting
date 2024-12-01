import { test, expect } from '@playwright/test';
import { navigateToLoginPage } from '../navigation-helpers';
import { LoginPage } from '../pages/LoginPage';
import fs from 'fs';
import { HomePage } from '../pages/HomePage';
import { CreateDocumentPage } from '../pages/CreateDocumentPage';
import { getRandomCredentials, getResourcesPath } from '../helpers';
import path from 'path';


test('Question 2: Text table', async ({ page }) => {
  // Navigate to the login page
  await navigateToLoginPage(page);

  // Get random credentials
  const { username, password } = await getRandomCredentials();

  // Get the instance of the login page
  const loginPage = await LoginPage.getInstance(page);

  // Pass the random username and password as parameters
  await loginPage.loginToProposify(username, password);

  const homePage = await HomePage.getInstance(page)
  await homePage.createNewDocument('Try Editor 3.0')
  await homePage.selectTemplate();

  let createDocumentPage = await CreateDocumentPage.getInstance(page)
  await createDocumentPage.createTableContent('Text Table')
  //You can choose any of the two available options {Text Table/ Pricing Table}
  await createDocumentPage.addTextToTableContent();

  // Get all rows before dragging
  let allRowsBefore = await page.locator('[role="rowgroup"]').locator('[role="row"]').all();
  const rowToDragContent = await allRowsBefore[1].textContent();

  // Perform the drag operation and confirm that the operation was successfull with correct assertion
  await createDocumentPage.dragRow(2, 3);
  let allRowsAfter = await page.locator('[role="rowgroup"]').locator('[role="row"]').all();
  expect(allRowsAfter.length).toBe(allRowsBefore.length);

  // Assert that the dragged row is now in the correct position
  const newPositionContent = await allRowsAfter[2].textContent();
  expect(newPositionContent).toBe(rowToDragContent);

  //Assert that the row that was originally at position 3 has moved up [OPTIONAL ASSERTION]
  const originalRow2Content = await allRowsBefore[1].textContent();
  const newRow2Content = await allRowsAfter[1].textContent();
  expect(newRow2Content).toBe(originalRow2Content);
});

test('Question 2: Pricing table', async ({ page }) => {
  // Navigate to the login page
  await navigateToLoginPage(page);

  // Get random credentials
  const { username, password } = await getRandomCredentials();

  // Get the instance of the login page
  const loginPage = await LoginPage.getInstance(page);

  // Pass the random username and password as parameters
  await loginPage.loginToProposify(username, password);

  const homePage = await HomePage.getInstance(page)
  await homePage.createNewDocument('Try Editor 3.0')
  await homePage.selectTemplate();

  let createDocumentPage = await CreateDocumentPage.getInstance(page)
  await createDocumentPage.createTableContent('Pricing Table')
  //You can choose any of the two available options {Text Table/ Pricing Table}
  await createDocumentPage.addTextToTableContent();

  // Get all rows before dragging
  let allRowsBefore = await page.locator('[role="rowgroup"]').locator('[role="row"]').all();
  const rowToDragContent = await allRowsBefore[1].textContent();

  // Perform the drag operation and confirm that the operation was successfull with correct assertion
  await createDocumentPage.dragRow(2, 4);
  // Add a 2-second delay
  await page.waitForTimeout(1000);
  let allRowsAfter = await page.locator('[role="rowgroup"]').locator('[role="row"]').all();
  expect(allRowsAfter.length).toBe(allRowsBefore.length);

  // Assert that the dragged row is now in the correct position
  const newPositionContent = await allRowsAfter[3].textContent();
  expect(newPositionContent).toBe(rowToDragContent);

  //Assert that the row that was originally at position 3 has moved up [OPTIONAL ASSERTION]
  const originalRow3Content = await allRowsBefore[1].textContent();
  const newRow2Content = await allRowsAfter[1].textContent();
  expect(newRow2Content).toBe(originalRow3Content);
});


const filesDirectoryPath: string = path.join(getResourcesPath(), '',
);

test('Question 3: Resize uploaded image', async ({ page }) => {
  // Navigate to the login page
  await navigateToLoginPage(page);

  // Get random credentials
  const { username, password } = await getRandomCredentials();

  // Get the instance of the login page
  const loginPage = await LoginPage.getInstance(page);

  // Pass the random username and password as parameters
  await loginPage.loginToProposify(username, password);

  const homePage = await HomePage.getInstance(page)
  await homePage.createNewDocument('Try Editor 3.0')
  await homePage.selectTemplate();

  let createDocumentPage = await CreateDocumentPage.getInstance(page)
  await createDocumentPage.uploadImage(filesDirectoryPath, 'Marvel.png')
  await createDocumentPage.resizeImage('250', '250')

  await createDocumentPage.aspect_ratio_locked_button.click();
  let imageHeight = await createDocumentPage.image_height_textbox.inputValue();
  let imageWidth = await createDocumentPage.image_width_textbox.inputValue();
  await expect(imageHeight).toContain('250')
  await expect(imageWidth).toContain('250')

  await createDocumentPage.resizeImageByDragging();
  imageHeight = await createDocumentPage.image_height_textbox.inputValue();
  imageWidth = await createDocumentPage.image_width_textbox.inputValue();
  await expect(imageHeight).not.toContain('250')
  await expect(imageWidth).not.toContain('250')

});